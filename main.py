print ("rohannilatkar")
# This is a comment 
print ("by using the hastag i python we can add comments")

# Lets jump on to variables in python
# A variable is a container for storing data values. In Python, you can create a variable by simply assigning a value to it. For example:


# strings

# some examples for strings are first name, last name, car, email etc.
first_name = "Rohan"
last_name = "Nilatkar"
car = "BMW"
email = "iix.preyliet@gmail.com"

print (f"My name is {first_name}")
print (f"My last name is {last_name}")
print (f"The car I will buy is {car}")
print (f"My email is {email}")

# integers

# some examples for integers are age, quantity, num_of_students etc.
age = 18
quantity = 3
num_of_students = 34

print (f"My age is {age}") 
print (f"I am buying {quantity} items")
print (f"The number of students in my class are {num_of_students}")

# Floats

# some examples for floats are price, weight, height etc.
price = 19.99
weight = 72.90
height = 5.9

print (f"The price of the item is ${price}")
print (f"My current weight is {weight} kilograms")
print (f"My current height is {height} feet")

# Booleans

# some examples for booleans are is_student, is_employed, has_license etc.

is_student = True

if is_student:
    print ("I'm a student")
else: 
    print ("I'm not a student")    

# Trying it with False

is_student = False

if is_student:
    print ("I'm a student")
else: 
    print ("I'm not a student")    


for_sale = True

if for_sale:
    print ("that item is for sale")

else:
    print ("that item is not for sale")    

# Trying it with False

for_sale = False

if for_sale:
    print ("that item is for sale")

else:
    print ("that item is not for sale")

# Moving on to Type Casting

# Before that found this day 3 code from gpt

# Conditional Statements

# Take input from user
marks = int(input("Enter your marks: "))

# Check conditions one by one
if marks >= 90:
    print("Grade A")  # runs if marks >= 90

elif marks >= 70:
    print("Grade B")  # runs if marks is between 70–89

elif marks >= 50:
    print("Grade C")  # runs if marks is between 50–69

else:
    print("Fail")     # runs if marks < 50

# 2. Loops

# Loop from 1 to 20
for i in range(1, 21):

    # Check if number is even
    if i % 2 == 0:
        print(i)  # print only even numbers
