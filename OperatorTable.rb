# Author:: John Eargle (mailto: jeargle at gmail.com)
# 2007-2015
# :title: OperatorTable

# This class holds the elements of a multiplication table.
# The table only contains ints or nil; the ints are indices
# into an ElementSet array.
# OperatorTables are generic so they may be used for Groups,
# Rings, Fields, etc.  No validation is done in this class
# for element placement, that happens in the corresponding
# Builder classes.
class OperatorTable

  # The +new+ class method initializes the class.
  # === Parameters
  # * _order_ = number of rows (and columns) in the table
  def initialize(order)
    @order = order
    @table = Array.new(@order)

    for i in 0..(@order-1) do
      @table[i] = Array.new(@order)
      for j in 0..(@order-1) do
	@table[i][j] = nil
      end
    end
  end

  # Number of Elements in the OperatorTable.
  def order
    return @order
  end

  # Set the element for a given position in the table.
  # === Parameters
  # _i_ = row
  # _j_ = column
  # _element_ = value to set the element to (int)
  def set_element(i,j,element)
    if 0 <= i && i < @order && 0 <= j && j < @order && 0 <= element && element < @order
      @table[i][j] = element
    end
    # XXX - else throw exception
  end

  # Get element index from the table.
  # === Parameters
  # _i_ = row
  # _j_ = column
  def get_element(i,j)
    return @table[i][j]
  end

  # Remove an element index from the table.
  # === Parameters
  # _i_ = row
  # _j_ = column
  def remove_element(i,j)
    @table[i][j] = nil
  end

end


# Symbol representation of an element.
class Element

  # The +new+ class method initializes the class.
  # === Parameters
  # _symbol_ = string representation of an element
  def initialize(symbol)
    @symbol = symbol
  end

  # Return the string representation.
  def symbol
    return @symbol
  end

  def to_s
    return @symbol
  end
  
end


# Array holding a set of Elements.
class ElementSet

  # The +new+ class method initializes the class.
  # === Parameters
  # _elementArray_ = array of Elements
  def initialize(elementArray)
    @elementArray = elementArray
  end

  # Number of Elements in the ElementSet.
  def order
    return @elementArray.length
  end

  # Retrieve the Element at a given index.
  # === Parameters
  # _i_ = index
  def element(i)
    return @elementArray[i]
  end

  # First Element is always the identity.
  def identity
    return @elementArray[0]
  end

end
