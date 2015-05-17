# Author:: John Eargle (mailto: jeargle at gmail.com)
# 2007-2015
# :title: GroupBuilder

require_relative 'OperatorTable'

# This class holds an intermediate representation for a Group that
# has not been fully built.  It should allow for the placement
# of Elements in an OperatorTable as long as they maintain the
# possibility of creating a valid Group.
class GroupBuilder

  # The +new+ class method initializes the class.
  # === Parameters
  # _elements_ = ElementSet with all the group elements
  def initialize(elements)
    @elements = elements
    @order = @elements.order
    @table = OperatorTable.new(@order)
    
    # Set first column and row to identity @elements.get_element(0)
    @table.set_element(0,0,0)
    (1..@order-1).each do |i|
      @table.set_element(0,i,i)
      @table.set_element(i,0,i)
    end
    
    # Table with bool arrays showing which elements are allowed in a cell
    @openTable = []

    # Table with associations that declare pairs of cells equal
    @associationTable = []
  end

  # Get a specific element.
  # === Parameters
  # _i_ = row
  # _j_ = column
  def get_element(i,j,element)
    return @table.get_element(i,j)
  end

  # Set a specific element.
  # XXX - can an element be overwritten or just set once?
  # === Parameters
  # _i_ = row
  # _j_ = column
  # _element_ = Element to assign to (i,j)
  def set_element(i,j,element)
    if 0 < i && i < @order &&
       0 < j && j < @order &&
       0 <= element && element < @order
      # Check against openTable
      @table.set_element(i,j,element)
    end
    # XXX - else throw exception
  end

  # Validate and build a corresponding Group.
  def build_group
    # Identity was set in initialize()
    # Inverses guaranteed by e in every column and every row

    # Must have full OperatorTable


    # Check associativity

  end

  # Create a String representation of the current table.
  def to_s
    # Set column width to size of largest element symbol
    columnWidth = 0
    (0..@order-1).each do |i|
      if columnWidth < @elements.element(i).symbol.length
	  columnWidth = @elements.element(i).symbol.length
      end
    end
    outString = " #{" ".rjust(columnWidth)} |"
    (0..@order-1).each do |i|
      outString += " #{@elements.element(i).symbol.rjust(columnWidth)} |"
    end
    outString += "\n"
    (0..@order).each do |i|
      outString += "-#{"-".rjust(columnWidth,"-")}-|"
    end
    outString += "\n"
    (0..@order-1).each do |i|
      outString += " #{@elements.element(i).symbol.rjust(columnWidth)} |"
      (0..@order-1).each do |j|
	outString += " #{@elements.element(@table.get_element(i,j)).symbol.rjust(columnWidth)} |"
      end
      outString += "\n"
    end
    return outString
  end

end


# Build a cyclic group.
# === Parameters
# _order_ = order of the group
# === Return
# _cyclicGroup_ = built cyclic group
def build_cyclic_group(order)
  
  if order <= 0
    return nil
  end

  cycleActionArray = Array.new(order)
  if order == 1
    cycleActionArray[0] = 0
  else
    cycleActionArray.each_index do |i|
      cycleActionArray[i] = i+1
    end
    cycleActionArray[order-1] = 0
  end
  cycle = Permutor.new(cycleActionArray)
  cyclicGroupBuilder = PermutationGroupBuilder.new([cycle])
  return cyclicGroupBuilder.get_group
  
end


# Build a dihedral group.
# === Parameters
# _degree_ = half of the order of the group
# === Return
# _dihedralGroup_ = built dihedral group
def build_dihedral_group(degree)

  if degree <= 0
    return nil
  end

  dihedralActionArray1 = Array.new(degree+2)
  dihedralActionArray2 = Array.new(degree+2)

  # XXX - should throw an exception; no Dih1 or Dih2
  if degree == 1 || degree == 2
    return build_cyclic_group(degree)
  else
    dihedralActionArray1.each_index do |i|
      dihedralActionArray1[i] = i+1
    end
    dihedralActionArray1[degree-1] = 0
    dihedralActionArray1[degree] = degree
    dihedralActionArray1[degree+1] = degree+1
    dihedralActionArray2.each_index do |i|
      dihedralActionArray2[i] = i
    end
    dihedralActionArray2[degree] = degree+1
    dihedralActionArray2[degree+1] = degree
  end
  dihed1 = Permutor.new(dihedralActionArray1)
  dihed2 = Permutor.new(dihedralActionArray2)
  dihedralGroupBuilder = PermutationGroupBuilder.new([dihed1,dihed2])
  return dihedralGroupBuilder.get_group

end


# Build a symmetry group.
# XXX - using WAY more generators than are needed
# === Parameters
# _degree_ = order of the group is degree!
# === Return
# _symmetryGroup_ = built symmetry group
def build_symmetry_group(degree)

  if degree <= 0
    return nil
  end

  if degree == 1 || degree == 2
    return build_cyclic_group(degree)
  end

  numActionArrays = (degree**2 - degree)/2
  symmetryActionArrays = Array.new(numActionArrays)
  # Build actionArrays like [0,1,2,...] then switch
  # elements at indices num1 and num2
  num1 = 0
  num2 = 1
  symmetryActionArrays.each_index do |i|
    symmetryActionArrays[i] = Array.new(degree)
    symmetryActionArrays[i].each_index do |j|
      symmetryActionArrays[i][j] = j
    end
    symmetryActionArrays[i][num1] = num2
    symmetryActionArrays[i][num2] = num1
    num2 += 1
    if num2 == degree
      num1 += 1
      num2 = num1 + 1
    end
  end
  
  transpositions = Array.new(numActionArrays)
  transpositions.each_index do |i|
    transpositions[i] = Permutor.new(symmetryActionArrays[i])
  end

  symmetryGroupBuilder = PermutationGroupBuilder.new(transpositions)

  return symmetryGroupBuilder.get_group

end


# Build an alternating group.
# XXX - using WAY more generators than are needed
# === Parameters
# _degree_ = order of the group is degree!/2
# === Return
# _alternatingGroup_ = built alternating group
def build_alternating_group(degree)

  if degree <= 1
    return nil
  end

  if degree == 2
    return build_cyclic_group(degree)
  end

  # Number generators = choose(degree,3)
  numActionArrays = degree * (degree-1) * (degree-2) / 6
  alternatingActionArrays = Array.new(numActionArrays)

  # Build actionArrays like [0,1,2,...]
  alternatingActionArrays.each_index do |i|
    alternatingActionArrays[i] = Array.new(degree)
    alternatingActionArrays[i].each_index do |j|
      alternatingActionArrays[i][j] = j
    end
  end

  # Switch elements at indices num1, num2, and num3
  arrayCount = 0
  (0..degree-3).each do |i|
    (i+1..degree-2).each do |j|
      (j+1..degree-1).each do |k|
	alternatingActionArrays[arrayCount][i] = j
	alternatingActionArrays[arrayCount][j] = k
	alternatingActionArrays[arrayCount][k] = i
	arrayCount += 1
      end
    end
  end
  
  transpositions = Array.new(numActionArrays)
  transpositions.each_index do |i|
    transpositions[i] = Permutor.new(alternatingActionArrays[i])
  end

  alternatingGroupBuilder = PermutationGroupBuilder.new(transpositions)

  return alternatingGroupBuilder.get_group

end


# Immutable, validated Group.
class Group
  
end
