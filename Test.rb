#!/usr/bin/ruby

require 'OperatorTable'
require 'GroupBuilder'
require 'Permutor'
require 'PermutationGroupBuilder'
require 'GroupFactory'


print "\n\n***** OperatorTable Test *****\n"

table = OperatorTable.new(2)
print("table.get_element(0,0): #{table.get_element(0,0)}\n")

table.set_element(0,0,0)
table.set_element(0,1,1)
table.set_element(1,0,1)
table.set_element(1,1,0)
print("table.get_element(0,0): #{table.get_element(0,0)}\n")
print("table.get_element(0,1): #{table.get_element(0,1)}\n")
print("table.get_element(1,0): #{table.get_element(1,0)}\n")
print("table.get_element(1,1): #{table.get_element(1,1)}\n")

print "\n\n***** GroupBuilder Test *****\n"
e = Element.new("0")
a = Element.new("1")
print(e.symbol + "\n")
testSet1 = ElementSet.new([e,a])
print(testSet1.order.to_s + "\n")
print(testSet1.element(0).symbol + "\n")
print(testSet1.element(1).symbol + "\n")
groupBuilder1 = GroupBuilder.new(testSet1)
groupBuilder1.set_element(1,1,0)
print "groupBuilder1:\n"
print groupBuilder1.to_s

print "\n"
b = Element.new("2")
c = Element.new("3")
d = Element.new("4")
testSet2 = ElementSet.new([e,a,b,c,d])
groupBuilder2 = GroupBuilder.new(testSet2)
groupBuilder2.set_element(1,1,2)
groupBuilder2.set_element(1,2,3)
groupBuilder2.set_element(1,3,4)
groupBuilder2.set_element(1,4,0)
groupBuilder2.set_element(2,1,3)
groupBuilder2.set_element(2,2,4)
groupBuilder2.set_element(2,3,0)
groupBuilder2.set_element(2,4,1)
groupBuilder2.set_element(3,1,4)
groupBuilder2.set_element(3,2,0)
groupBuilder2.set_element(3,3,1)
groupBuilder2.set_element(3,4,2)
groupBuilder2.set_element(4,1,0)
groupBuilder2.set_element(4,2,1)
groupBuilder2.set_element(4,3,2)
groupBuilder2.set_element(4,4,3)
print "groupBuilder2:\n"
print groupBuilder2.to_s

#testArray1 = [0]
#testArray1.each do |i|
#  if i < 10
#    testArray1.push(i+1)
#  end
#  print "#{i} "
#end
#print "\n"


puts "\n\n***** Permutor Test *****"
a = Permutor.new([0,1,2,3,4,5])
puts a

puts a.op(1)
puts a.op(5)

b = [0,1,2]
puts "b: " + b.to_s
puts

e = Permutor.new([0,1,2])
puts "e: " + e.to_s

x = Permutor.new([1,2,0])
puts "x: " + x.to_s
puts "xx: " + x.operate(x).to_s
puts "xxx: " + x.operate(x.operate(x)).to_s
puts

y = Permutor.new([0,2,1])
puts "y: " + y.to_s
puts "yy: " + y.operate(y).to_s
puts

puts "yx: " + y.operate(x).to_s
puts "xy: " + x.operate(y).to_s
puts

puts "to_s2 (actionArray)"
puts "e: " + e.to_s2
puts "x: " + x.to_s2
puts "y: " + y.to_s2
puts

puts "(1 == 2): " + (1 == 2).to_s
puts "(1 == 1): " + (1 == 1).to_s
puts "([0,1,2] == [0,1,2]): " + ([0,1,2] == [0,1,2]).to_s
puts "([0,1,2] == [0,1,2,3]): " + ([0,1,2] == [0,1,2,3]).to_s
puts

z = Permutor.new([1,2,0])
puts "(e == e): " + (e == e).to_s
puts "(e == x): " + (e == x).to_s
puts "(e == y): " + (e == y).to_s
puts "(x == x): " + (x == x).to_s
puts "(x == y): " + (x == y).to_s
puts "(x == z): " + (x == z).to_s


puts "\n\n***** PermutationGroupBuilder Test *****"

perm1 = Permutor.new([1,2,3,4,5,6,0])
pgb1 = PermutationGroupBuilder.new([perm1])
pgb1.build_group
pgb1.print_permutors

perm2 = Permutor.new([1,0,3,2])
pgb2 = PermutationGroupBuilder.new([perm2])
pgb2.build_group
pgb2.print_permutors

perm3 = Permutor.new([1,0,2,3])
perm4 = Permutor.new([0,1,3,2])
pgb3 = PermutationGroupBuilder.new([perm3,perm4])
pgb3.build_group
pgb3.print_permutors


puts "\n\n***** GroupFactory Test *****"

groupFactory1 = GroupFactory.new()
groupFactory1.build_cyclic_group(13)
groupFactory1.build_dihedral_group(7)
groupFactory1.build_symmetry_group(4)
groupFactory1.build_alternating_group(4)
