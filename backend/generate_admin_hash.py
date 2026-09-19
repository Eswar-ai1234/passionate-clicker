from security import hash_password

password = input("Enter admin password: ")

hashed_password = hash_password(password)

print("\nYour password hash is:")
print(hashed_password)