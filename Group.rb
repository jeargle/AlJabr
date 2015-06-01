# Author:: John Eargle (mailto: jeargle at gmail.com)
# 2007-2015
# :title: Group

require_relative 'OperatorTable'


# Immutable, validated Group.
class Group

  # The +new+ class method initializes the class.
  # === Parameters
  # _elements_ = ElementSet with all the group elements
  def initialize(elements, table)
    @elements = elements
    @order = @elements.order
    @table = table
  end

  # Get the identity element.
  # === Return
  # _element_ = the identity element
  def get_identity
    return @table.get_element(0, 0)
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

  # Get the group index of an element.
  # === Parameters
  # _el_ = index into element array
  # === Return
  # _index_ = index of the element
  def element_index?(el)
    if el == 0
      return @order
    elsif el >= @order
      print "Error: element index too large"
      return 0
    end

    order = element_order?(el)
    if order == 0
      print "Error: element order is 0"
    end

    return @order/order
  end

  # Create a String representation of the current operator table.
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
	# outString += " #{@elements.element(@table.get_element(i, j)).symbol.rjust(columnWidth)} |"
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

end
