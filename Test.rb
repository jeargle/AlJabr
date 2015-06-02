#!/usr/bin/ruby

require_relative 'OperatorTable'
require_relative 'GroupBuilder'
require_relative 'PermutationGroupBuilder'


def test_OperatorTable()
  print "\n\n***** OperatorTable Test *****\n"
  
  table = OperatorTable.new(2)
  print("table.get_element(0, 0): #{table.get_element(0, 0)}\n")
  
  table.set_element(0, 0, 0)
  table.set_element(0, 1, 1)
  table.set_element(1, 0, 1)
  table.set_element(1, 1, 0)
  print("table.get_element(0, 0): #{table.get_element(0, 0)}\n")
  print("table.get_element(0, 1): #{table.get_element(0, 1)}\n")
  print("table.get_element(1, 0): #{table.get_element(1, 0)}\n")
  print("table.get_element(1, 1): #{table.get_element(1, 1)}\n")
end


def test_GroupBuilder()
  print "\n\n***** GroupBuilder Test *****\n"
  e = Element.new("e")
  a = Element.new("a")
  print(e.symbol + "\n")
  testSet1 = ElementSet.new([e, a])
  print("order: #{testSet1.order}\n")
  print("0: #{testSet1.element(0).symbol}\n")
  print("1: #{testSet1.element(1).symbol}\n")
  groupBuilder1 = GroupBuilder.new(testSet1)
  print "groupBuilder1:\n"
  print groupBuilder1.to_s
  groupBuilder1.set_element(1, 1, 0)
  print "groupBuilder1:\n"
  print groupBuilder1.to_s
  print "\n"
  print "order e: #{groupBuilder1.element_order?(0)}\n"
  print "order a: #{groupBuilder1.element_order?(1)}\n"

  b = Element.new("b")
  c = Element.new("c")
  d = Element.new("d")
  testSet2 = ElementSet.new([e, a, b, c, d])
  groupBuilder2 = GroupBuilder.new(testSet2)
  print "groupBuilder2:\n"
  print groupBuilder2.to_s
  groupBuilder2.set_element(1, 1, 2)
  groupBuilder2.set_element(1, 2, 3)
  groupBuilder2.set_element(1, 3, 4)
  groupBuilder2.set_element(1, 4, 0)
  print "groupBuilder2:\n"
  print groupBuilder2.to_s
  print "open positions 1:\n"
  print bool_table_to_s(groupBuilder2.open_positions?(1))
  print "open positions 2:\n"
  print bool_table_to_s(groupBuilder2.open_positions?(2))
  print "open positions 3:\n"
  print bool_table_to_s(groupBuilder2.open_positions?(3))
  print "open positions 4:\n"
  print bool_table_to_s(groupBuilder2.open_positions?(4))
  groupBuilder2.set_element(2, 1, 3)
  groupBuilder2.set_element(2, 2, 4)
  groupBuilder2.set_element(2, 3, 0)
  groupBuilder2.set_element(2, 4, 1)
  groupBuilder2.set_element(3, 1, 4)
  groupBuilder2.set_element(3, 2, 0)
  groupBuilder2.set_element(3, 3, 1)
  groupBuilder2.set_element(3, 4, 2)
  groupBuilder2.set_element(4, 1, 0)
  groupBuilder2.set_element(4, 2, 1)
  groupBuilder2.set_element(4, 3, 2)
  groupBuilder2.set_element(4, 4, 3)
  print "groupBuilder2:\n"
  print groupBuilder2.to_s
  print "\n"
  print "order e: #{groupBuilder2.element_order?(0)}\n"
  print "order a: #{groupBuilder2.element_order?(1)}\n"
  print "order b: #{groupBuilder2.element_order?(2)}\n"
  print "order c: #{groupBuilder2.element_order?(3)}\n"
  print "order d: #{groupBuilder2.element_order?(4)}\n"

  o = Element.new("1")
  om = Element.new("-1")
  i = Element.new("i")
  im = Element.new("-i")
  j = Element.new("j")
  jm = Element.new("-j")
  k = Element.new("k")
  km = Element.new("-k")
  testSet3 = ElementSet.new([o, om, i, im, j, jm, k, km])
  groupBuilder3 = GroupBuilder.new(testSet3)
  print "quaternion group:\n"
  print groupBuilder3.to_s
  groupBuilder3.set_element(1, 1, 0)
  groupBuilder3.set_element(1, 2, 3)
  groupBuilder3.set_element(2, 1, 3)
  groupBuilder3.set_element(1, 3, 2)
  groupBuilder3.set_element(3, 1, 2)
  groupBuilder3.set_element(1, 4, 5)
  groupBuilder3.set_element(4, 1, 5)
  groupBuilder3.set_element(1, 5, 4)
  groupBuilder3.set_element(5, 1, 4)
  groupBuilder3.set_element(1, 6, 7)
  groupBuilder3.set_element(6, 1, 7)
  groupBuilder3.set_element(1, 7, 6)
  groupBuilder3.set_element(7, 1, 6)
  print "quaternion group:\n"
  print groupBuilder3.to_s
  print "open positions 1:\n"
  print bool_table_to_s(groupBuilder3.open_positions?(1))
  print "open positions 2:\n"
  print bool_table_to_s(groupBuilder3.open_positions?(2))
  print "open positions 3:\n"
  print bool_table_to_s(groupBuilder3.open_positions?(3))
  print "open positions 4:\n"
  print bool_table_to_s(groupBuilder3.open_positions?(4))
  groupBuilder3.set_element(2, 2, 1)
  groupBuilder3.set_element(3, 3, 1)
  groupBuilder3.set_element(4, 4, 1)
  groupBuilder3.set_element(5, 5, 1)
  groupBuilder3.set_element(6, 6, 1)
  groupBuilder3.set_element(7, 7, 1)
  groupBuilder3.set_element(2, 3, 0)
  groupBuilder3.set_element(3, 2, 0)
  groupBuilder3.set_element(4, 5, 0)
  # groupBuilder3.set_element(5, 4, 0)
  # groupBuilder3.set_element(6, 7, 0)
  # groupBuilder3.set_element(7, 6, 0)
  groupBuilder3.set_element(6, 4, 2)
  groupBuilder3.set_element(4, 6, 3)
  groupBuilder3.set_element(4, 2, 6)
  groupBuilder3.set_element(2, 4, 7)
  groupBuilder3.set_element(2, 6, 4)
  groupBuilder3.set_element(6, 2, 5)
  print "quaternion group:\n"
  print groupBuilder3.to_s
  print "order 1: #{groupBuilder3.element_order?(0)}\n"
  print "order -1: #{groupBuilder3.element_order?(1)}\n"
  print "order i: #{groupBuilder3.element_order?(2)}\n"
  print "order -i: #{groupBuilder3.element_order?(3)}\n"
  print "order j: #{groupBuilder3.element_order?(4)}\n"
  print "order -j: #{groupBuilder3.element_order?(5)}\n"
  print "order k: #{groupBuilder3.element_order?(6)}\n"
  print "order -k: #{groupBuilder3.element_order?(7)}\n"
end
  

def test_Permutor()
  puts "\n\n***** Permutor Test *****"
  a = Permutor.new([0, 1, 2, 3, 4, 5])
  puts a
  
  puts a.op(1)
  puts a.op(5)
  
  e = Permutor.new([0, 1, 2])
  puts "e: " + e.to_s
  puts "ee: " + e.operate(e).to_s
  puts "eee: " + e.operate(e.operate(e)).to_s
  
  x = Permutor.new([1, 2, 0])
  puts "x: " + x.to_s
  puts "xx: " + x.operate(x).to_s
  puts "xxx: " + x.operate(x.operate(x)).to_s
  puts
  
  y = Permutor.new([0, 2, 1])
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
  puts "([0, 1, 2] == [0, 1, 2]): " + ([0, 1, 2] == [0, 1, 2]).to_s
  puts "([0, 1, 2] == [0, 1, 2, 3]): " + ([0, 1, 2] == [0, 1, 2, 3]).to_s
  puts
  
  z = Permutor.new([1, 2, 0])
  puts "(e == e): " + (e == e).to_s
  puts "(e == x): " + (e == x).to_s
  puts "(e == y): " + (e == y).to_s
  puts "(x == x): " + (x == x).to_s
  puts "(x == y): " + (x == y).to_s
  puts "(x == z): " + (x == z).to_s
  
  
  puts "\n\n***** PermutationGroupBuilder Test *****"
  
  perm1 = Permutor.new([1, 2, 3, 4, 5, 6, 0])
  pgb1 = PermutationGroupBuilder.new([perm1])
  g1 = pgb1.build_group
  pgb1.print_permutors

  perm2 = Permutor.new([1, 0, 3, 2])
  pgb2 = PermutationGroupBuilder.new([perm2])
  g2 = pgb2.build_group
  pgb2.print_permutors
  
  perm3 = Permutor.new([1, 0, 2, 3])
  perm4 = Permutor.new([0, 1, 3, 2])
  pgb3 = PermutationGroupBuilder.new([perm3, perm4])
  g3 = pgb3.build_group
  pgb3.print_permutors
end


def test_group_builders()
  puts "\n\n***** Group Builder Function Tests *****"
  
  g13 = build_cyclic_group(13)
  g7 = build_dihedral_group(7)
  g3 = build_symmetry_group(3)
  g4 = build_alternating_group(4)
  print "g13 order 1: #{g13.element_order?(1)}\n"
  print "g13 index 1: #{g13.element_index?(1)}\n"
  print g13.to_s + "\n"
  print "g7 order 1: #{g7.element_order?(1)}\n"
  print "g7 index 1: #{g7.element_index?(1)}\n"
  print g7.to_s + "\n"
  print "g3 order 1: #{g3.element_order?(1)}\n"
  print "g3 index 1: #{g3.element_index?(1)}\n"
  print g3.to_s + "\n"
  print "g4 order 1: #{g4.element_order?(1)}\n"
  print "g4 index 1: #{g4.element_index?(1)}\n"
  print g4.to_s + "\n"
end


def test_cyclic_groups()
  puts "\n\n***** Cyclic Group Test *****"

  g1 = build_cyclic_group(1)
  g2 = build_cyclic_group(2)
  g3 = build_cyclic_group(3)
  g4 = build_cyclic_group(4)
  g5 = build_cyclic_group(5)
  g10 = build_cyclic_group(10)
  g20 = build_cyclic_group(20)
  # g30 = build_cyclic_group(30)  # order 30
  # g40 = build_cyclic_group(40)  # order 40
  print g1.to_s + "\n"
  print g2.to_s + "\n"
  print g3.to_s + "\n"
  print g4.to_s + "\n"
  print g5.to_s + "\n"
  print g10.to_s + "\n"
  print g20.to_s + "\n"
end


def test_dihedral_groups()
  puts "\n\n***** Dihedral Group Test *****"

  g1 = build_dihedral_group(1)
  g2 = build_dihedral_group(2)
  g3 = build_dihedral_group(3)
  g4 = build_dihedral_group(4)
  g5 = build_dihedral_group(5)
  g6 = build_dihedral_group(6)
  g7 = build_dihedral_group(7)  # order 14
  print g1.to_s + "\n"
  print g2.to_s + "\n"
  print g3.to_s + "\n"
  print g4.to_s + "\n"
  print g5.to_s + "\n"
  print g6.to_s + "\n"
  print g7.to_s + "\n"
end


def test_symmetry_groups()
  puts "\n\n***** Symmetry Group Test *****"

  g1 = build_symmetry_group(1)
  g2 = build_symmetry_group(2)
  g3 = build_symmetry_group(3)
  g4 = build_symmetry_group(4)
  # g5 = build_symmetry_group(5)  # order 120
  print g1.to_s + "\n"
  print g2.to_s + "\n"
  print g3.to_s + "\n"
  print g4.to_s + "\n"
  # print g5.to_s + "\n"
end


def test_alternating_groups()
  puts "\n\n***** Alternating Group Test *****"

  g1 = build_alternating_group(1)
  g2 = build_alternating_group(2)
  g3 = build_alternating_group(3)
  g4 = build_alternating_group(4)
  # g5 = build_alternating_group(5)  # order 60
  print g1.to_s + "\n"
  print g2.to_s + "\n"
  print g3.to_s + "\n"
  print g4.to_s + "\n"
  # print g5.to_s + "\n"
end


def bool_table_to_s(table)
  # Set column width to size of largest element symbol
  order = table.length
  columnWidth = 1
  outString = " #{" ".rjust(columnWidth)} |"
  (0..order-1).each do |i|
    outString += " #{i} |"
  end
  outString += "\n"
  (0..order).each do |i|
    outString += "-#{"-".rjust(columnWidth, "-")}-|"
  end
  outString += "\n"
  (0..order-1).each do |i|
    outString += " #{i} |"
    (0..order-1).each do |j|
      if table[i][j]
	outString += " 1 |"
      else
	outString += " 0 |"
      end
    end
    outString += "\n"
  end
  return outString
end


test_OperatorTable()
test_GroupBuilder()
test_Permutor()
test_group_builders()
test_cyclic_groups()
test_dihedral_groups()
test_symmetry_groups()
test_alternating_groups()
