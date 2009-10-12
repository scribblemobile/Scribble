class PrinterController < ApplicationController
  
  
  
  def index
    
    @cards = Card.paginate :page => params[:page], :conditions=>"cards.printer_status != 1", :per_page => 10, :order => 'created_at ASC'
    
    
    # @cards = Card.find(:all, :conditions=>"cards.printer_status != 1", :order=>"created_at ASC")
    
  end


end
