from security import hash_password

password = input("Enter admin password: ")

print("\nPassword hash:")
print(hash_password(password))