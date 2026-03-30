# Typecasting = the process of converting a variable from one data typew to another 
#               str(), int(), float(), bool()

name = "Rohan Nilatkar"
age = 18 
gpa = 3.2
is_student = True

print(type(name))
print(type(age))
print(type(gpa))
print(type(is_student))

# gpa into a integer

gpa = int(gpa)

print(gpa)

# age into a float

age = float(age)

print(age)

# age into a string 

age = str(age)

print(age)

# name into a boolean

name = bool(name)

print(name)

# Now trying it with no name given it will provide false as output with no name given as friend

friend = ""

friend = bool(friend)

print(friend)