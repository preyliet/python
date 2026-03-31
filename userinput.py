# Taking user input for name (string)
name = input("Enter your name: ")

# Taking user input for age (string initially)
age = input("Enter your age: ")

# Converting age from string to integer
age = int(age)

# Printing output
print("Hello", name)
print("You will be", age + 5

      # Taking numbers from user
num1 = float(input("Enter first number: "))
num2 = float(input("Enter second number: "))

# Taking operation
operation = input("Enter operation (+, -, *, /): ")

# Performing calculation
if operation == "+":
    print("Result:", num1 + num2)

elif operation == "-":
    print("Result:", num1 - num2)

elif operation == "*":
    print("Result:", num1 * num2)

elif operation == "/":
    if num2 != 0:
        print("Result:", num1 / num2)
    else:
        print("Error: Division by zero")

else:
    print("Invalid operation")
