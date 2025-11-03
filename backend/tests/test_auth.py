import pytest
from backend.auth import verify_password, get_password_hash

def test_password_hashing():
    """
    Tests that a password can be hashed and then verified correctly.
    """
    password = "testpassword123"
    hashed_password = get_password_hash(password)

    # Check that the hash is not the same as the password
    assert password != hashed_password

    # Check that the password verifies correctly
    assert verify_password(password, hashed_password)

    # Check that a wrong password does not verify
    assert not verify_password("wrongpassword", hashed_password)

if __name__ == "__main__":
    pytest.main()
