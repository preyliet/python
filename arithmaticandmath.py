# Day 6 Project: Arithmetic & Math Calculator 🧮

# # Importing math module for advanced operations
import math

# # Taking input from user
num1 = float(input("Enter first number: "))
num2 = float(input("Enter second number: "))

# # Arithmetic operations
print("\n--- Basic Arithmetic Operations ---")
print("Addition:", num1 + num2)        # +
print("Subtraction:", num1 - num2)     # -
print("Multiplication:", num1 * num2)  # *
print("Division:", num1 / num2)        # /
print("Modulus:", num1 % num2)        # remainder
print("Power:", num1 ** num2)         # exponent

# # Advanced math operations using math module
print("\n--- Advanced Math Operations ---")
print("Square root of first number:", math.sqrt(num1))
print("Square root of second number:", math.sqrt(num2))
print("Ceiling of first number:", math.ceil(num1))   # round up
print("Floor of second number:", math.floor(num2))   # round down
print("Factorial of first number:", math.factorial(int(num1)))  # only works with integers