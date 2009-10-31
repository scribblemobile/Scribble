class UsersController < ApplicationController
  
  require 'digest/sha1'
  
  def login
    if request.post?
      
      if params[:auto_login_token]
        @user = User.find_by_auto_login_token(params[:auto_login_token])
      else
        @user = User.authenticate(params[:email],params[:password])
      end
      
      if @user
          
          @user.login_count = @user.login_count + 1;
          @user.phone_os = params[:phone_OS] if params[:phone_OS]
          @user.device_model = params[:device_model] if params[:device_model]
          @user.scribble_version = params[:scribble_version] if params[:scribble_version]
         
          @user.save!          
          @error = 0
      else
        user2 = User.find_by_email(params[:email])
        @error = user2 ? 2 : 1
      end
    else
      @error = 6
      cookies[:form_authenticity_token] = {:value => form_authenticity_token, :expires => 10.years.from_now}
    end
    
    respond_to do |format|
        format.xml { render }
    end
    
  end
  
  
  def update
    
    @user = User.find(params[:id])
    
    #unless params[:user][:draftphoto].nil?
      #@user.draftphoto = params[:user][:draftphoto]
    #else
      attributes = params
      attributes.delete('authenticity_token')
      attributes.delete('_method')
      attributes.delete('action')
      attributes.delete('controller')
      @user.update_attributes(attributes)
    #end
    
    @user.save!
      
  end
  
  def export_project_to_excel
      e = Excel::Workbook
      @users = User.find(:all)
      @cards = Card.find(:all)
      @addresses = Address.find(:all)
      e.addWorksheetFromActiveRecord "Users", "users", @users
      e.addWorksheetFromActiveRecord "Cards", "cards", @cards
      e.addWorksheetFromActiveRecord "Addresses", "addresses", @addresses
      headers['Content-Type'] = "application/vnd.ms-excel"
      render_text(e.build)
    end
  
  def index
    @users = User.find(:all, :order=>:created_at)
    
    @cards = Card.find(:all)
    
    @addresses = Address.find(:all)
    
    @tobeprinted_cards = Card.find(:all, :conditions=>"cards.printer_status != 1", :order=>"created_at ASC")
    
    @revenue = Card.find(:first, :select=>["SUM(price_paid) as rev"])
     
    @totalusers = @users.length
  end


  def logout
  end


  def register
    
    if request.post?
      
      @error = 0  
      user = User.find_by_email(params[:email])
        
      if user
        @error = 1  #email account exists
      else 
       @user = User.create!(:email => params[:email], 
                    :password => params[:password], 
                    :first_name => params[:first_name].capitalize(),
                    :last_name => params[:last_name].capitalize(),
                    :device_id => params[:device_id],
                    :phone_os => params[:phone_OS],
                    :device_model => params[:device_model],
                    :scribble_version => params[:scribble_version],
                    :login_count => 0,
                    :auto_login_token => Digest::SHA1.hexdigest("///#{params[:email]}///#{params[:password]}///some auto login salt///")
                    )
        @user_id = @user.id
       
        #Postoffice.deliver_welcome(params[:first_name].capitalize(),params[:email])
      end
    end
    
    respond_to do |format|
        format.xml { render }
    end
    
    
  end

end
