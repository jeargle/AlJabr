# Author:: John Eargle (mailto: jeargle at gmail.com)
# 2007-2013
# :title: PermutationGroupBuilder

require_relative 'GroupBuilder'


# Permutation representation of a group element from the symmetric group.
class Permutor

  # The +new+ class method initializes the class.
  # === Parameters
  # _actionArray_ = permutor representation
  def initialize(actionArray)
    # Validate actionArray
    # actionArray must be an array of integers from 0..actionArray.length-1
    # each integer appears only once
    # the array is a map from integer i to the integer actionArray[i]
    for i in 0..(actionArray.length-1)
         if !actionArray.include?(i)
           print 'Error: bad actionArray'
         end
    end
    @actionArray = actionArray
  end

  # Equality
  # === Parameters
  # _permutor_ = permutor to compare against
  def ==(permutor)
    return (to_s == permutor.to_s)
  end

  # 
  # === Parameters
  # _permutor_ = 
  def operate(permutor)
    if (order != permutor.order)
      return nil
    end
    tempActionArray = Array.new(@actionArray.length)
    for i in 0..(tempActionArray.length-1)
      tempActionArray[i] = op(permutor.op(i))
    end
    return Permutor.new(tempActionArray)
  end

  # Return an element of actionArray.
  # === Parameters
  # _num_ = index into actionArray
  def op(num)
    #puts "op num: " + num.to_s
    return @actionArray[num]
  end

  # Size of actionArray.
  def order
    return @actionArray.length
  end

  # Return a string representation of actionArray.
  def to_s2
    str = "["
    @actionArray.each do |i|
      str += i.to_s + " "
    end

    str = str.chop
    str += "]"
    return str
  end

  # Return a string representation of actionArray.
  def to_s
    str = ""
    markArray = Array.new(@actionArray.length)

    for i in 0..(@actionArray.length-1)
      if !markArray[i] && @actionArray[i] != i
	markArray[i] = 1
	str += "(" + i.to_s + " "
	j = @actionArray[i]
	str += j.to_s + " "
	while !markArray[j] && @actionArray[j] != i
	  markArray[j] = 1
	  j = @actionArray[j]
	  str += j.to_s + " "
	end
	markArray[j] = 1
	str = str.chop + ") "
      end
    end
    
    # Identity element represented as 'e'
    str = str.chop
    if str.length == 0
      return "e"
    end
    return str
  end

end


class PermutationGroupBuilder

  # The +new+ class method initializes the class.
  # Pass in array of Permutors
  # === Parameters
  # _generators_ = array of generators represented as +Permutors+
  def initialize(generators)
    @generators = generators
    @permutors = Array.new()
    @group = nil
    # XXX - get_valid_generators
    @permutorOrder = @generators[0].order
  end

  # Return a hash from generators to booleans (whether they're valid or not)
  #   A generator is valid if it has the largest order of a set of conflicting
  #   generators (e.g. r is valid compared with r^2 and r^3).
  def get_valid_generators
    
  end

  # Create a list of all elements with which to build the Group
  #   Breadth-first search using the generators and starting with the identity
  #   element.
  def find_elements
    # Walk each generator down the Permutor array, multiplying by the current
    # permutor and adding any new results to the end of the array.
    identityActionArray = Array.new()
    (0..@permutorOrder-1).each do |i|
      identityActionArray.push(i)
    end
    @permutors.push(Permutor.new(identityActionArray))

    @permutors.each do |i|
      @generators.each do |j|
	tempPermutor = j.operate(i)
	if !@permutors.include?(tempPermutor)
	  @permutors.push(tempPermutor)
	end
      end
    end

  end

  # Build a group from a set of permutor generators.
  def build_group
    if @permutors.length == 0
      find_elements
    end

    # Create ElementSet corresponding to permutors
    elementArray = Array.new()
    (0..@permutors.length-1).each do |i|
      elementArray.push(Element.new("#{i}"))
    end
    elements = ElementSet.new(elementArray)

    # Loop through elements and fill out GroupBuilder
    groupBuilder = GroupBuilder.new(elements)
    (1..@permutors.length-1).each do |i|
      (1..@permutors.length-1).each do |j|
	groupBuilder.set_element(i, j, @permutors.index(@permutors[j].operate(@permutors[i])))
        if groupBuilder.complete?
          # print "COMPLETE\n"
          break
        end
      end
      if groupBuilder.complete?
        # print "COMPLETE\n"
        break
      end
    end
    puts "group:"
    puts groupBuilder
  end

  # Retrieve the current group.
  # === Return
  # _group_ = Group
  def get_group
    if @group == nil
      build_group
    end
    return @group
  end

  # Print the permutors that generate the group.
  def print_permutors
    (0..@permutors.length-1).each do |i|
      print "#{i}: #{@permutors[i]}\n"
    end
  end

end

