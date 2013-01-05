# Author:: John Eargle (mailto: jeargle at gmail.com)
# 2007-2013
# :title: PermutationGroupBuilder

# Permutation representation of a group element from the symmetric group.
class Permutor

  # The +new+ class method initializes the class.
  # === Parameters
  # _actionArray_ = permutor representation that takes an index and returns the index's value
  def initialize(actionArray)
    @actionArray = actionArray    
  end

  def ==(permutor)
    return (to_s == permutor.to_s)
  end

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

  def op(num)
    #puts "op num: " + num.to_s
    return @actionArray[num]
  end

  def order()
    return @actionArray.length
  end

  # Return a string representation of actionArray
  def to_s2()
    str = "["
    @actionArray.each do |i|
      str += i.to_s + " "
    end
    str = str.chop
    str += "]"
    return str
  end

  # Return a string representation of actionArray
  def to_s()
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
    str = str.chop
    if str.length == 0
      return "e"
    end
    return str
  end

end

