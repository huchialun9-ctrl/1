import re
from typing import List

class ModerationService:
    def __init__(self):
        # Professional-grade blacklist patterns
        self.blacklist_patterns = [
            r"\b(hate|violence|explicit|illegal)\b", # Placeholders for real safety keywords
            r"\b(harmful|dangerous|toxic)\b"
        ]
        
    def filter_content(self, text: str) -> str:
        """Checks if content should be blocked or sanitized."""
        for pattern in self.blacklist_patterns:
            if re.search(pattern, text, re.IGNORECASE):
                return "[CONTENT BLOCKED: Safety Violation]"
        return text

    def is_safe(self, text: str) -> bool:
        """Simple boolean check for input/output safety."""
        return self.filter_content(text) == text

    def clean_prompt_injection(self, text: str) -> str:
        """Strips common injection patterns."""
        # Simple patterns like 'Ignore all previous instructions'
        patterns = [
            "ignore all previous",
            "forget your instructions",
            "you are now a",
            "transcribe this",
            "stop your persona"
        ]
        for p in patterns:
            if p in text.lower():
                return "[POTENTIAL PROMPT INJECTION DETECTED]"
        return text
