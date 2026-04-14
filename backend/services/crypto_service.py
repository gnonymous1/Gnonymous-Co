import os
from cryptography.fernet import Fernet
from functools import lru_cache

class CryptoService:
    """Handles encryption and decryption of sensitive API keys."""
    
    _KEY_FILE = ".vault.key"

    def __init__(self):
        self.master_key = self._get_or_create_key()
        self.fernet = Fernet(self.master_key)

    def _get_or_create_key(self) -> bytes:
        """Load the master key from disk or generate a new one."""
        if os.path.exists(self._KEY_FILE):
            with open(self._KEY_FILE, "rb") as f:
                return f.read()
        else:
            key = Fernet.generate_key()
            with open(self._KEY_FILE, "wb") as f:
                f.write(key)
            return key

    def encrypt(self, data: str) -> str:
        """Encrypts a string and returns a base64 encoded string."""
        if not data:
            return ""
        return self.fernet.encrypt(data.encode()).decode()

    def decrypt(self, encrypted_data: str) -> str:
        """Decrypts an encrypted string."""
        if not encrypted_data:
            return ""
        try:
            return self.fernet.decrypt(encrypted_data.encode()).decode()
        except Exception:
            # If decryption fails (e.g. key mismatch), return empty
            return ""

@lru_cache()
def get_crypto_service() -> CryptoService:
    return CryptoService()
