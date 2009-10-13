class PrinterController < ApplicationController
  
  
  
  def index
    
    if params[:shipped] == '1'
      noshipped = 0
    else
      noshipped = 1
    end
    
    @cards = Card.paginate :page => params[:page], :conditions=>"cards.printer_status != #{noshipped}", :per_page => 25, :order => 'created_at ASC'
    
    
    # @cards = Card.find(:all, :conditions=>"cards.printer_status != 1", :order=>"created_at ASC")
    
  end


end
