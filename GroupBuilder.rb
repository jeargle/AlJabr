# Author:: John Eargle (mailto: jeargle at gmail.com)
# 2007-2010
# :title: GroupBuilder

require 'OperatorTable'

class GroupBuilder

  # The +new+ class method initializes the class.
  # === Parameters
  # _elements_ = ElementSet with all the group elements
  def initialize(elements)
    @elements = elements
    @order = @elements.order
    @table = OperatorTable.new(@order)

    # Set first column and row to identity @elements.getElement(0)
    @table.setElement(0,0,0)
    (1..@order-1).each do |i|
      @table.setElement(0,i,i)
      @table.setElement(i,0,i)
    end
  end

  # Set a specific element.
  # === Parameters
  # _i_ = row
  # _j_ = column
  # _element_ = Element to assign to (i,j)
  def setElement(i,j,element)
    if 0 < i && i < @order && 0 < j && j < @order && 0 <= element && element < @order
      @table.setElement(i,j,element)
    end
    # XXX - else throw exception
  end

  # Build a group.
  def buildGroup()

  end

  # Create a String representation of the current table.
  def to_s()
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
	outString += " #{@elements.element(@table.getElement(i,j)).symbol.rjust(columnWidth)} |"
      end
      outString += "\n"
    end
    return outString
  end

end


