# Author:: John Eargle (mailto: jeargle at gmail.com)
# 2007-2010
# :title: PermutationGroupBuilder

require 'GroupBuilder'
require 'Permutor'

class PermutationGroupBuilder

  # The +new+ class method initializes the class.
  # Pass in array of Permutors
  # === Parameters
  # _generators_ = array of generators represented as +Permutors+
  def initialize(generators)
    @generators = generators
    @permutors = Array.new()
    @group = nil
    # XXX - getValidGenerators
    @permutorOrder = @generators[0].order
  end

  # Return a hash from generators to booleans (whether they're valid or not)
  #   A generator is valid if it has the largest order of a set of conflicting
  #   generators (e.g. r is valid compared with r^2 and r^3).
  def getValidGenerators()
    
  end

  # Create a list of all elements with which to build the Group
  #   Breadth-first search using the generators and starting with the identity
  #   element.
  def findElements()
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
  def buildGroup()
    if @permutors.length == 0
      findElements
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
	groupBuilder.setElement(i,j,@permutors.index(@permutors[j].operate(@permutors[i])))
      end
    end
    puts "group:"
    puts groupBuilder
  end

  # Retrieve the current group.
  # === Return
  # _group_ = Group
  def getGroup()
    if @group == nil
      buildGroup
    end
    return @group
  end

  # Print the permutors that generate the group.
  def printPermutors()
    (0..@permutors.length-1).each do |i|
      print "#{i}: #{@permutors[i]}\n"
    end
  end

end

