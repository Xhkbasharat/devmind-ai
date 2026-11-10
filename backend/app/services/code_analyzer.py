
import ast
from collections import Counter
from dataclasses import asdict, dataclass


@dataclass
class CodeIssue:
    rule: str
    severity: str
    line: int
    message: str
    recommendation: str


class CodeAnalyzer:
    """
    Static Python code analyzer.

    Uses AST inspection only. Submitted source code is never executed.
    The checks are heuristic and do not replace a full security audit.
    """

    SEVERITY_PENALTIES = {
        "critical": 15,
        "high": 10,
        "medium": 5,
        "low": 2,
    }

    def analyze(self, source_code: str) -> dict:
        if not isinstance(source_code, str) or not source_code.strip():
            raise ValueError("Python source code cannot be empty.")

        try:
            tree = ast.parse(source_code)
        except SyntaxError as exc:
            return {
                "valid_syntax": False,
                "syntax_error": {
                    "line": exc.lineno,
                    "column": exc.offset,
                    "message": exc.msg,
                },
                "quality_score": 0,
                "issues": [],
                "summary": "Python syntax validation failed.",
            }

        issues: list[CodeIssue] = []

        self._check_unused_imports(tree, issues)
        self._check_function_docstrings(tree, issues)
        self._check_function_length(tree, issues)
        self._check_nesting(tree, issues)
        self._check_broad_exceptions(tree, issues)
        self._check_mutable_defaults(tree, issues)

        score = self._calculate_score(issues)

        counts = Counter(issue.severity for issue in issues)

        return {
            "valid_syntax": True,
            "quality_score": score,
            "total_issues": len(issues),
            "severity_counts": dict(counts),
            "issues": [asdict(issue) for issue in issues],
            "summary": self._build_summary(score, issues),
        }

    def _check_unused_imports(
        self,
        tree: ast.AST,
        issues: list[CodeIssue],
    ) -> None:
        imported_names = []

        for node in ast.walk(tree):
            if isinstance(node, ast.Import):
                for alias in node.names:
                    name = alias.asname or alias.name.split(".")[0]
                    imported_names.append((name, node.lineno))

            elif isinstance(node, ast.ImportFrom):
                for alias in node.names:
                    if alias.name == "*":
                        continue

                    name = alias.asname or alias.name
                    imported_names.append((name, node.lineno))

        source_names = {
            node.id
            for node in ast.walk(tree)
            if isinstance(node, ast.Name)
            and isinstance(node.ctx, ast.Load)
        }

        for name, line in imported_names:
            if name not in source_names:
                issues.append(
                    CodeIssue(
                        rule="unused_import",
                        severity="low",
                        line=line,
                        message=f"Import '{name}' may be unused.",
                        recommendation=(
                            "Remove the import if it is not required."
                        ),
                    )
                )

    def _check_function_docstrings(
        self,
        tree: ast.AST,
        issues: list[CodeIssue],
    ) -> None:
        for node in ast.walk(tree):
            if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)):
                if ast.get_docstring(node) is None:
                    issues.append(
                        CodeIssue(
                            rule="missing_docstring",
                            severity="low",
                            line=node.lineno,
                            message=(
                                f"Function '{node.name}' has no docstring."
                            ),
                            recommendation=(
                                "Add a docstring describing the function."
                            ),
                        )
                    )

    def _check_function_length(
        self,
        tree: ast.AST,
        issues: list[CodeIssue],
    ) -> None:
        for node in ast.walk(tree):
            if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)):
                length = node.end_lineno - node.lineno + 1

                if length > 50:
                    issues.append(
                        CodeIssue(
                            rule="long_function",
                            severity="medium",
                            line=node.lineno,
                            message=(
                                f"Function '{node.name}' contains "
                                f"{length} lines."
                            ),
                            recommendation=(
                                "Split the function into smaller units."
                            ),
                        )
                    )

    def _check_nesting(
        self,
        tree: ast.AST,
        issues: list[CodeIssue],
    ) -> None:
        for node in ast.walk(tree):
            if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)):
                max_depth = self._max_nesting_depth(node.body)

                if max_depth > 4:
                    issues.append(
                        CodeIssue(
                            rule="deep_nesting",
                            severity="medium",
                            line=node.lineno,
                            message=(
                                f"Function '{node.name}' has "
                                f"nesting depth {max_depth}."
                            ),
                            recommendation=(
                                "Reduce nested conditions and loops."
                            ),
                        )
                    )

    def _max_nesting_depth(self, statements: list, depth: int = 0) -> int:
        maximum = depth

        nested_types = (
            ast.If,
            ast.For,
            ast.AsyncFor,
            ast.While,
            ast.With,
            ast.AsyncWith,
            ast.Try,
        )

        for statement in statements:
            if isinstance(statement, nested_types):
                child_bodies = []

                for attribute in (
                    "body",
                    "orelse",
                    "finalbody",
                ):
                    child_bodies.extend(
                        getattr(statement, attribute, [])
                    )

                if isinstance(statement, ast.Try):
                    for handler in statement.handlers:
                        child_bodies.extend(handler.body)

                maximum = max(
                    maximum,
                    self._max_nesting_depth(
                        child_bodies,
                        depth + 1,
                    ),
                )

        return maximum

    def _check_broad_exceptions(
        self,
        tree: ast.AST,
        issues: list[CodeIssue],
    ) -> None:
        for node in ast.walk(tree):
            if isinstance(node, ast.ExceptHandler):
                if node.type is None or (
                    isinstance(node.type, ast.Name)
                    and node.type.id == "Exception"
                ):
                    issues.append(
                        CodeIssue(
                            rule="broad_exception",
                            severity="medium",
                            line=node.lineno,
                            message="Broad exception handling detected.",
                            recommendation=(
                                "Catch specific exception types."
                            ),
                        )
                    )

    def _check_mutable_defaults(
        self,
        tree: ast.AST,
        issues: list[CodeIssue],
    ) -> None:
        for node in ast.walk(tree):
            if not isinstance(
                node,
                (ast.FunctionDef, ast.AsyncFunctionDef),
            ):
                continue

            for default in node.args.defaults:
                if isinstance(default, (ast.List, ast.Dict, ast.Set)):
                    issues.append(
                        CodeIssue(
                            rule="mutable_default",
                            severity="high",
                            line=default.lineno,
                            message=(
                                f"Function '{node.name}' uses a "
                                "mutable default argument."
                            ),
                            recommendation=(
                                "Use None as the default and create "
                                "the mutable object inside the function."
                            ),
                        )
                    )

    def _calculate_score(self, issues: list[CodeIssue]) -> int:
        penalty = sum(
            self.SEVERITY_PENALTIES.get(issue.severity, 0)
            for issue in issues
        )

        return max(0, 100 - penalty)

    def _build_summary(
        self,
        score: int,
        issues: list[CodeIssue],
    ) -> str:
        if not issues:
            return "No issues detected by the configured static checks."

        return (
            f"Preliminary quality score: {score}/100. "
            f"Detected {len(issues)} potential issue(s). "
            "Review the findings before changing the source code."
        )


code_analyzer = CodeAnalyzer()
      
