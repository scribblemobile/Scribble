class MailedController < ApplicationController
  def index
  end

  def show
    
    @id = params[:id]
    
    @card = Card.find(@id)
    
    @card.printer_status = params[:status]
    @card.save!
    
    respond_to do |format|
        format.js { render }
    end
    
  end

end
