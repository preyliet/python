# Day 5 Project: Mad Libs Game 🎭

# # Taking inputs from the user
# input() is used to take data from user and store it in variables
name = input("Enter a name: ")
place = input("Enter a place: ")
animal = input("Enter an animal: ")
food = input("Enter a food: ")
verb = input("Enter a verb (action): ")
adjective = input("Enter an adjective: ")

# # Creating a story using f-string
# f-string allows us to insert variables directly inside a string
story = f"""
One day, {name} went to {place}.
While walking, they saw a {adjective} {animal}.
Surprisingly, the {animal} was eating {food} and started to {verb}!
{name} couldn't believe their eyes and started laughing loudly.
It turned out to be the most unforgettable day ever!
"""

# # Printing the final story
# \n is used to add a new line before printing
print("\n🎉 Your Mad Libs Story 🎉")
print(story)

# # End of program
# This is a simple project combining user input + string formatting
