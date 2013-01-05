# Author:: John Eargle (mailto: jeargle at gmail.com)
# 2007-2013
# :title: OperatorTable

# This class holds the elements of a multplication table.
class OperatorTable

  # The +new+ class method initializes the class.
  # === Parameters
  # * _order_ = number of rows and columns in the table
  def initialize(order)
    @order = order
    @table = Array.new(@order)

    for i in 0..(@order-1) do
      @table[i] = Array.new(@order)
      for j in 0..(order-1) do
	@table[i][j] = nil
      end
    end

    #@table.each do |i|
    #  i = Array.new(order)
    #  i.each do |j|
#	j = @elementSet.element(0)
#	puts "j: " + j.symbol
#      end
#      i.each do |k|
#	puts "k: " + k.symbol
#      end
#    end

#    @table.each do |i|
#      i.each do |j|
#	puts "blah: " + j.to_s
#      end
#    end

    #print("@table.length: " + @table.length.to_s + "\n")
    #print("@table[0].length: " + @table[0].length.to_s + "\n")

#    (0..(order-1)).each do |i|
#      (0..(order-1)).each do |j|
#	print("total[" + i.to_s + "][" + j.to_s + "]\n")
#      end
#    end
  end

  def order
    return @order
  end

  # Set the element for a given position in the table.
  # === Parameters
  # _i_ = row
  # _j_ = column
  # _element_ = value to set the element to
  def set_element(i,j,element)
    if 0 <= i && i < @order && 0 <= j && j < @order && 0 <= element && element < @order
      @table[i][j] = element
    end
    # XXX - else throw exception
  end

  # Get element from the table.
  # === Parameters
  # _i_ = row
  # _j_ = column
  def get_element(i,j)
    return @table[i][j]
  end

  # Remove an element from the table.
  # === Parameters
  # _i_ = row
  # _j_ = column
  def remove_element(i,j)
    @table[i][j] = nil
  end

  def check_element(i,j)
    
  end

  def check_row(rowIndex,element)
    
  end

  def check_column(columnIndex,element)

  end

end


# Symbol representation of a Group element.
class Element

  def initialize(symbol)
    @symbol = symbol
  end

  def symbol
    return @symbol
  end

end


# Set of Elements that make up a Group.
class ElementSet

  def initialize(elementArray)
    @elementArray = elementArray
  end

  def order
    return @elementArray.length
  end

  def element(i)
    return @elementArray[i]
  end

end


# Say hello.
class Hello

  attr_reader :msg
  
  def initialize
    @msg = "Yo, holmes!"
  end

end


# Throwaway test class.
class Vector
  
  attr_reader :array

  def initialize(array)
    @array = array
  end

  def length
    return @array.length
  end

  def add(vector)
    if vector.length == @array.length
      sum = Array.new([vector.array[0] + @array[0]])
      for i in 1..(@array.length-1)
	sum.push(vector.array[i] + @array[i])
      end
      return Vector.new(sum)
    else
      print "Error: Vectors should have same length"
    end
  end

  def dot(vector)
    if vector.length == @array.length
      sum = 0
      for i in 0..(@array.length-1)
	sum += vector.array[i] * @array[i]
      end
      return sum
    else
      print "Error: Vectors should have same length"
    end
  end

  def to_s()
    str = @array[0].to_s
    for i in 1..(@array.length-1)
      str += " " + @array[i].to_s
    end
    return str
  end

end
