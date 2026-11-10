
import ast
import io
import tokenize
from typing import Any


FEATURE_NAMES = [
    "lines_of_code",
    "function_count",
    "class_count",
    "cyclomatic_complexity",
    "max_nesting_depth",
    "import_count",
    "exception_handler_count",
    "comment_count",
    "average_function_length",
    "branch_count",
    "long_function_count",
    "total_parameters",
]


class CodeFeatureExtractor:
    """
    Extract measurable software-engineering features from Python code.

    Source code is parsed statically. It is never executed.
    Metrics are heuristic indicators, not definitive quality judgments.
    """

    def extract(self, source_code: str) -> dict[str, Any]:
        if not isinstance(source_code, str) or not source_code.strip():
            raise ValueError("Source code cannot be empty.")

        try:
            tree = ast.parse(source_code)
        except SyntaxError as exc:
            raise ValueError(
                f"Invalid Python syntax: {exc.msg} at line {exc.lineno}"
            ) from exc

        lines = source_code.splitlines()
        non_empty_lines = [
            line for line in lines if line.strip()
        ]

        functions = [
            node
            for node in ast.walk(tree)
            if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef))
        ]

        classes = [
            node
            for node in ast.walk(tree)
            if isinstance(node, ast.ClassDef)
        ]

        imports = [
            node
            for node in ast.walk(tree)
            if isinstance(node, (ast.Import, ast.ImportFrom))
        ]

        exception_handlers = [
            node
            for node in ast.walk(tree)
            if isinstance(node, ast.ExceptHandler)
        ]

        branches = [
            node
            for node in ast.walk(tree)
            if isinstance(
                node,
                (
                    ast.If,
                    ast.For,
                    ast.AsyncFor,
                    ast.While,
                    ast.IfExp,
                    ast.Assert,
                ),
            )
        ]

        function_lengths = [
            node.end_lineno - node.lineno + 1
            for node in functions
            if node.end_lineno is not None
        ]

        total_parameters = sum(
            len(node.args.posonlyargs)
            + len(node.args.args)
            + len(node.args.kwonlyargs)
            + int(node.args.vararg is not None)
            + int(node.args.kwarg is not None)
            for node in functions
        )

        max_nesting_depth = self._max_nesting_depth(tree)

        comment_count = self._count_comments(source_code)

        lines_of_code = len(non_empty_lines)

        average_function_length = (
            sum(function_lengths) / len(function_lengths)
            if function_lengths
            else 0.0
        )

        long_function_count = sum(
            1 for length in function_lengths if length > 50
        )

        # Approximation based on common branching constructs.
        cyclomatic_complexity = 1 + len(branches)

        features = {
            "lines_of_code": lines_of_code,
            "function_count": len(functions),
            "class_count": len(classes),
            "cyclomatic_complexity": cyclomatic_complexity,
            "max_nesting_depth": max_nesting_depth,
            "import_count": len(imports),
            "exception_handler_count": len(exception_handlers),
            "comment_count": comment_count,
            "average_function_length": round(
                average_function_length, 2
            ),
            "branch_count": len(branches),
            "long_function_count": long_function_count,
            "total_parameters": total_parameters,
        }

        features["comment_density"] = round(
            comment_count / max(lines_of_code, 1),
            3,
        )

        return features

    def _count_comments(self, source_code: str) -> int:
        count = 0

        try:
            tokens = tokenize.generate_tokens(
                io.StringIO(source_code).readline
            )

            for token in tokens:
                if token.type == tokenize.COMMENT:
                    count += 1

        except (tokenize.TokenError, IndentationError):
            return count

        return count

    def _max_nesting_depth(
        self,
        tree: ast.AST,
    ) -> int:
        nested_nodes = (
            ast.If,
            ast.For,
            ast.AsyncFor,
            ast.While,
            ast.With,
            ast.AsyncWith,
            ast.Try,
        )

        def visit(statements, depth=0):
            maximum = depth

            for statement in statements:
                if isinstance(statement, nested_nodes):
                    child_bodies = [
                        getattr(statement, "body", []),
                        getattr(statement, "orelse", []),
                        getattr(statement, "finalbody", []),
                    ]

                    if isinstance(statement, ast.Try):
                        child_bodies.extend(
                            handler.body
                            for handler in statement.handlers
                        )

                    for body in child_bodies:
                        maximum = max(
                            maximum,
                            visit(body, depth + 1),
                        )

            return maximum

        return visit(getattr(tree, "body", []))


feature_extractor = CodeFeatureExtractor()
      
