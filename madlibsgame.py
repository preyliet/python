# Day 5: Mad Libs Game 🎭

# Taking user inputs
name = input("Enter a name: ")
place = input("Enter a place: ")
animal = input("Enter an animal: ")
food = input("Enter a food: ")
verb = input("Enter a verb (action): ")
adjective = input("Enter an adjective: ")

# Creating the story
story = f"""
One day, {name} went to {place}.
While walking, they saw a {adjective} {animal}.
Surprisingly, the {animal} was eating {food} and started to {verb}!
{name} couldn't believe their eyes and started laughing loudly.
It turned out to be the most unforgettable day ever!
"""

# Printing the final story
print("\n🎉 Your Mad Libs Story 🎉")
print(story)