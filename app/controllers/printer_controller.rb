class PrinterController < ApplicationController
  
  
  
  def index
    
     @cards = Card.find(:all, :conditions=>"cards.printer_status != 1")
    
  end


end
