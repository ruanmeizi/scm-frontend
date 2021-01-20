# frozen_string_literal: true
require 'pry-byebug'
require 'thor'
class Hammer < Thor
  include Thor::Actions
  source_root '.'
end

class Hash
  def method_missing(methodname, *params)
    if self.class == Hash
      self[methodname] || self[methodname.to_s]
    else
      super
    end
  end
end

def exec_cmd(*cmdstr, **opt)
  hammer.say cmdstr.join(' ')
  ret = hammer.run(cmdstr.join(' '), opt)
  exit -1 unless ret
  ret
end

def hammer
  @hammer ||= Hammer.new
end
 
