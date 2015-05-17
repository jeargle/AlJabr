# Author:: John Eargle (mailto: jeargle at gmail.com)
# 2007-2015
# :title: Group

require_relative 'OperatorTable'


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
  def get_identity
    return @table.get_element(0,0)
  end

  # Get a specific element.
  # === Parameters
  # _i_ = row
  # _j_ = column
  def get_element(i,j,element)
    return @table.get_element(i,j)
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
