class DiscountsController < ApplicationController
  
  
  def index
    
     @codes = Discount.find(:all)
    
    if params[:discount]
     @code = Discount.new(params[:discount])
     @code.code = @code.code.upcase
     @code.save
     flash[:notice] = "Code Added"
      redirect_to '/discounts?password=scribbleprintz'
   end
  end

  def create
    
   
   
  end
  
  
  def check_code
    
    #recieves device token and the code
    
    @valid = 0
    @error = ""
    #first check if valid code
    @codes = Discount.find_by_code(params[:code])
    
    unless @codes.nil?
      @valid = 1
    else
      @valid = 0
      @error = "Invalid Code"
    end
    
    #then check the code has not been used by this person
    if @valid == 1
      @redeemed = Redemption.find_by_code_and_device_id(params[:code],params[:device_id])
      unless @redeemed.nil?
        @valid = 0
        @error = "Code already used"
      end
    end
    
  end
  
  
end
