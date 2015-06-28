# Author:: John Eargle (mailto: jeargle at gmail.com)
# 2007-2015
# :title: GroupBuilder

require_relative 'OperatorTable'
require_relative 'Group'

require 'set'

# This class holds an intermediate representation for a Group that
# has not been fully built.  It should allow for the placement
# of Elements in an OperatorTable as long as they maintain the
# possibility of creating a valid Group.
class GroupBuilder

  attr_reader :order

  # The +new+ class method initializes the class.
  # === Parameters
  # _elements_ = ElementSet with all the group elements
  def initialize(elements)
    @elements = elements
    @order = @elements.order
    @table = OperatorTable.new(@order)

    # Table with bool arrays showing which elements are allowed in a cell
    @openTable = Array.new(@order)
    (0..@order-1).each do |i|
      @openTable[i] = Array.new(@order)
      (0..@order-1).each do |j|
        @openTable[i][j] = (0..@order-1).to_set
      end
    end

    # Table with associations that declare pairs of cells equal
    @associationTable = Array.new(@order)
    @associationTable = Array.new(@order)
    (0..@order-1).each do |i|
      @associationTable[i] = Array.new(@order)
    end

    # Set first column and row to identity
    set_element(0, 0, 0)
    # Last element is automatically set by set_element()
    (1..@order-2).each do |i|
      set_element(0, i, i)
      set_element(i, 0, i)
    end
  end

  # Get a specific element.
  # === Parameters
  # _i_ = row
  # _j_ = column
  # === Return
  # _element_ = the element at position (i, j)
  def get_element(i, j)
    return @table.get_element(i, j)
  end

  # Set a specific element.
  # XXX - can an element be overwritten or just set once?
  # === Parameters
  # _i_ = row
  # _j_ = column
  # _element_ = Element to assign to (i, j)
  def set_element(i, j, element)
    # print "set_element(#{i}, #{j}, #{element})\n"
    if 0 <= i && i < @order &&
       0 <= j && j < @order &&
       0 <= element && element < @order

      if @openTable[i][j].size == 0
        if element != @table.get_element(i, j)
          print "Error: cannot change (#{i}, #{j}): #{@table.get_element(i, j)} to #{element}\n"
        else
          # print "Already set\n"
        end
        return nil
      end
      
      # Is this element still allowed to be placed here?
      if !@openTable[i][j].include?(element)
        print "Error: element #{element} is not allowed at (#{i}, #{j})\n"
        print "@openTable[i][j]:"
        @openTable[i][j].each do |x|
          print "#{x} "
        end
        print "\n"
        return nil
      end
      
      markQueue = []
      markQueue.push([i, j, element])
      while markQueue.length > 0
        row, col, el = markQueue.shift
        check_associativity_rules(row, col)
        @table.set_element(row, col, el)
        add_associativity_rules(row, col, el)

        # Remove element from other cells in this row and column
        @openTable[row][col].clear()
        for x in (0..@order-1)
          # Remove from column
          if @openTable[x][col].include?(el)
            @openTable[x][col].delete(el)
            if @openTable[x][col].size == 1
              @openTable[x][col].each do |lastEl|
                markQueue.push([x, col, lastEl])
              end
            end
          end
          # Remove from row
          if @openTable[row][x].include?(el)
            @openTable[row][x].delete(el)
            if @openTable[row][x].size == 1
              @openTable[row][x].each do |lastEl|
                markQueue.push([row, x, lastEl])
              end
            end
          end
        end
      end
    end
    # XXX - else throw exception
  end

  # Get the order of an element.
  # === Parameters
  # _el_ = element index
  # === Return
  # _order_ = order of the element
  def element_order?(el)
    if el == 0
      return 1
    elsif el >= @order
      print "Error: element index too large"
      return 0
    end

    order = 1
    el_power = el
    # Loop through powers of el
    while el_power != nil and el_power != 0
      el_power = @table.get_element(el_power, el)
      order += 1
    end

    if el_power == nil
      return 0
    end

    return order
  end

  # Get a table showing where an element can be placed.
  # === Parameters
  # _el_ = element index
  # === Return
  # _table_ = boolean mask of @openTable showing open positions
  def open_positions?(el)
    # Table with bool arrays showing which elements are allowed in a cell
    open = Array.new(@order)
    (0..@order-1).each do |i|
      open[i] = Array.new(@order, false)
      (0..@order-1).each do |j|
        if @openTable[i][j].size > 0 and @openTable[i][j].member?(el)
          open[i][j] = true
        end
      end
    end
    return open
  end

  # Check associativity rules for this position.
  # === Parameters
  # _i_ = row
  # _j_ = column
  def check_associativity_rules(row, col)
    if @associationTable[row][col] != nil
      # print "Association rule: #{@associationTable[row][col]}\n"
    end
  end

  # Add any new associativity rules that result from the addition
  # of this element ad this position.
  # === Parameters
  # _i_ = row
  # _j_ = column
  # _el_ = element index to assign to (i, j)
  def add_associativity_rules(row, col, el)
    if row == col
      # a(aa) = (aa)a
      # aa = b
      # => ab = ba
      @associationTable[row][el] = [el, row]
      @associationTable[el][row] = [row, el]
    else
      if el == @table.get_element(row, col)
        # a(ba) = (ab)a
        # ba = c, ab = c (a and b commute)
        # => ac = ca, bc = cb
        @associationTable[row][el] = [el, row]
        @associationTable[el][row] = [row, el]
        @associationTable[col][el] = [el, col]
        @associationTable[el][col] = [col, el]
      end

      # b(aa) = (ba)a, a(ab) = (aa)b
      # aa = c, ba = d, ab = f
      # => bc = da, af = cb
      
      # a(ba) = (ab)a, b(ab) = (ba)b
      # ba = c, ab = d
      # => ac = da, bd = cb
      
      # Most general case
      # c(ba) = (cb)a
      # ba = d, cb = f
      # cd = fa
    end
  end

  # Whether the operator table is completely filled out or not
  def complete?
    return @table.complete?
  end

  # Validate and build a corresponding Group.
  def build_group
    # Identity was set in initialize()
    # Inverses guaranteed by e in every column and every row
    # Associativity guaranteed by association checks

    # Must have full OperatorTable
    if complete?
      return Group.new(@elements, @table)
    end
  end

  # Create a String representation of the current (maybe incomplete) table.
  # === Return
  # _s_ = string representation of the operator table
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
      outString += "-#{"-".rjust(columnWidth, "-")}-|"
    end
    outString += "\n"
    (0..@order-1).each do |i|
      outString += " #{@elements.element(i).symbol.rjust(columnWidth)} |"
      (0..@order-1).each do |j|
        if @table.get_element(i, j) == nil
	  outString += " #{'.'.rjust(columnWidth)} |"
        else
	  outString += " #{@elements.element(@table.get_element(i, j)).symbol.rjust(columnWidth)} |"
        end
      end
      outString += "\n"
    end
    return outString
  end

  def print_openTable
    (0..@order-1).each do |i|
      print "row #{i}\n"
      (0..@order-1).each do |j|
        print "   col #{j}\n"
        print "      "
        # print "openTable[#{i}][#{j}].class: #{@openTable[i][j].class}\n"
        # print "openTable[#{i}][#{j}].size: #{@openTable[i][j].size}\n"
        # print "openTable[0][0].size: #{@openTable[0][0].size}\n"
        @openTable[i][j].each do |el|
          # print "#{el.class} "
          print "#{el} "
        end
        print "\n"
      end
    end
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
  dihedralGroupBuilder = PermutationGroupBuilder.new([dihed1, dihed2])
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
  # Build actionArrays like [0, 1, 2, ...] then switch
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

  # Number generators = choose(degree, 3)
  numActionArrays = degree * (degree-1) * (degree-2) / 6
  alternatingActionArrays = Array.new(numActionArrays)

  # Build actionArrays like [0, 1, 2, ...]
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


# Build the direct product group of two existing groups.
# === Parameters
# _group1_ = first group
# _group2_ = second group
# === Return
# _directProduct_ = direct product of group1 and group2
def build_product_group(group1, group2)

  elArray = []
  elCount = 0
  backMap = Array.new(group1.order)
  backMap2 = []
  # Create new ElementSet
  for i in (0..group1.order-1)
    backMap[i] = Array.new(group2.order)
    for j in (0..group2.order-1)
      elArray.push(Element.new("(#{group1.elements.element(i).symbol},#{group2.elements.element(j).symbol})"))
      backMap[i][j] = elCount
      elCount += 1
      backMap2.push([i, j])
    end
  end

  elements = ElementSet.new(elArray)
  productBuilder = GroupBuilder.new(elements)

  # Loop through Groups
  for i in (0..productBuilder.order-1)
    for j in (0..productBuilder.order-1)
      el1 = group1.get_element(backMap2[i][0], backMap2[j][0])
      el2 = group2.get_element(backMap2[i][1], backMap2[j][1])
      productBuilder.set_element(i, j, backMap[el1][el2])
    end
  end
  
  return productBuilder.build_group
end