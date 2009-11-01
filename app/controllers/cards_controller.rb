class CardsController < ApplicationController
  # GET /cards
  # GET /cards.xml
  
  require 'json'
  require "faster_csv"
   require "prawn/core"
   require "prawn/layout"
   require "open-uri"
  
  
  
  def index
    @cards = Card.find(:all)

    respond_to do |format|
      format.html # index.html.erb
      format.xml  { render :xml => @cards }
    end
  end

  # GET /cards/1
  # GET /cards/1.xml
  def show
    
    
   # require "prawn/fast_png"
    
    @card = Card.find(params[:id])

  
    respond_to do |format|
      format.html # index.html.erb
      format.xml  { render :xml => @cards }
      format.pdf  { render :layout => false }
    end
   
    



  end

  # GET /cards/new
  # GET /cards/new.xml
  def new
    @card = Card.new

    respond_to do |format|
      format.html # new.html.erb
      format.xml  { render :xml => @card }
    end
  end

  # GET /cards/1/edit
  def edit
    @card = Card.find(params[:id])
  end

  # POST /cards
  # POST /cards.xml
  def create
    
    unless params{:scribble_version}.nil?
    
      @card = Card.new
      @user = User.find(params[:user_id])
      
      @card.photo = @user.draftphoto_file_name
      @card.user_id = params[:user_id]
      
      unless params[:message].nil?
        @card.message = params[:message]
      end
      unless params[:frame].nil?
        @card.frame = params[:frame]
      end
      unless params[:copy_me].nil?
        @card.copy_me = params[:copy_me]
      end
      unless params[:add_map].nil?
        @card.add_map = params[:add_map]
      end
      unless params[:lat].nil?
        @card.lat = params[:lat]
      end
      unless params[:lng].nil?
        @card.lng = params[:lng]
      end
      unless params[:price_paid].nil?
        @card.price_paid = params[:price_paid].to_f
      end
      unless params[:receipt].nil?
        @card.receipt = params[:receipt]
      end
      @card.save!
      @jobid = @card.id.to_i + 7000000
      @card.job_id = @jobid
      @card.printer_status = 0
      @card.save!
      
      @addresses = JSON.parse(params[:addresses_json])
      
      for address in @addresses
        @contact = Address.new
        @contact.card_id = @card.id
        unless address['first_name'].nil?
          @contact.first_name = address['first_name']
        end
        unless address['last_name'].nil?
          @contact.last_name = address['last_name']
        end
        unless address['street'].nil?
          @contact.street = address['street']
        end
        unless address['city'].nil?
          @contact.city = address['city']
        end
        unless address['state'].nil?
          @contact.state = address['state']
        end
        unless address['zip'].nil?
          @contact.zip = address['zip']
        end
        unless address['country'].nil?
          @contact.country = address['country']
        end
        unless address['countryCode'].nil?
          @contact.countryCode = address['countryCode']
        end
        unless address['price'].nil?
          @contact.price = address['price']
        end
        
        @contact.save!
      end
      
      
      directory = "public/cards/#{@card.id}/"
      FileUtils.mkdir_p(directory) unless File.directory?(directory)
      
      #FileUtils.copy("public/users/draftphotos/#{@card.user_id}/#{@card.photo}", "#{directory}/#{@card.photo}")
      
      #copy full-size
      FileUtils.copy("public/users/draftphotos/#{@card.user_id}/original_#{@user.draftphoto_file_name}", "#{directory}/original_#{@user.draftphoto_file_name}")
      
      #copy thumb
      FileUtils.copy("public/users/draftphotos/#{@card.user_id}/small_#{@user.draftphoto_file_name}", "#{directory}/small_#{@user.draftphoto_file_name}")
      
      
      pdf = Prawn::Document.new(:page_size => [414, 324], :margins=>0)
      pdf.bounding_box [0,288], :width => 414 do
      	pigs = "#{RAILS_ROOT}/public/images/cards/frame#{@card.frame}.jpg" 
      	pdf.image pigs, :at => [-36,0], :fit => [414, 324]

      	pdf.canvas do
      	  pdf.bounding_box([33,292], :width => 215) do
      		  pigs = "#{RAILS_ROOT}/public/cards/#{@card.id}/original_#{@card.photo}" 
      		  pdf.image pigs, :at => [0,0], :fit => [215, 215]
      	  end
        end
      end



      pdf.bounding_box [230,250], :width => 110 do
    		pdf.font "#{RAILS_ROOT}/public/images/cards/mafw.ttf"
      	pdf.text @card.message, :leading=>5
      end

      pdf.render_file "#{RAILS_ROOT}/public/cards/#{@card.id}/#{@jobid}_file_1.pdf"


     
      pdf2 = Prawn::Document.new(:page_size => [414, 324], :margins=>0)

      pdf2.bounding_box [0,288], :width => 414 do
      	pigs = "#{RAILS_ROOT}/public/images/cards/back.jpg" 
      	pdf2.image pigs, :at => [-36,0], :fit => [414, 324]
      end
      
  


      if @card.lat
      	if @card.lat != 0
      		s = Hash.new
      	s[:pic_google_map]="http://maps.google.com/staticmap?center=#{@card.lat},#{@card.lng}&zoom=10&size=640x456&maptype=terrain&markers=#{@card.lat},#{@card.lng},red&key=ABQIAAAALF-_g5rNREDtjEue6txM3xQP7nTGYYVCHHTU9L3Hb_ZDidErMhSGz6PAfvIlqt6bAp17W_SZPV9HeA&format=jpg-baseline"
      		pdf2.bounding_box [149,270], :width => 210 do
      		pdf2.image open(s[:pic_google_map]), :at => [0,0], :fit => [210, 150]
    		end
      	end
       end

      pdf2.render_file "#{RAILS_ROOT}/public/cards/#{@card.id}/#{@jobid}_file_2.pdf"

     
      
      
      
    else
    
      @card = Card.new(params[:card])

      respond_to do |format|
        if @card.save
          flash[:notice] = 'Card was successfully created.'
          format.html { redirect_to(@card) }
          format.xml  { render :xml => @card, :status => :created, :location => @card }
        else
          format.html { render :action => "new" }
          format.xml  { render :xml => @card.errors, :status => :unprocessable_entity }
        end
      end
    end
  end


  def generate_xml
    
    @card = Card.find(params[:id])
    @addresses = Address.find(:all, :conditions=>"card_id=#{@card.id}")
    @user = User.find(:first, :conditions=>"id=#{@card.user_id}")
    
    respond_to do |format|
      format.xml  { render }
    end
    
  end

def generate_card


end


def generate_csv
  
  #coped in printcontroller
    @card = Card.find(params[:id])
    @addresses = Address.find(:all, :conditions=>"card_id=#{@card.id}")
    @user = User.find(@card.user_id)
    @jobname = "#{@card.job_id}_csv"


    csv_string = FasterCSV.generate do |csv|
      csv << ["LINETYPE", "COUNT", "JOBID", "FIRSTNAME", "LASTNAME", "TITLE", "BUSINESS", "ADDRESS", "ADDRESS2", "CITY", "STATE", "ZIP", "COUNTRY", "DELIVERY POINT BARCODE", "SNGL PC", "CARRIER ROUTE", "WALK SEQUENCE", "CUSTOM1", "CUSTOM2", "CUSTOM3", "CUSTOM4", "CUSTOM5", "FILE_1", "FILE_2"]

      @addresses.each do |record|
        
        if record['first_name'].nil?
          record['first_name'] = " "
        end
        if record['last_name'].nil?
          record['last_name'] = " "
        end
        if record['street'].nil?
          record['street'] = " "
        end
        if record['city'].nil?
          record['city'] = " "
        end
        if record['state'].nil?
          record['state'] = " "
        end
        if record['country'].nil?
          record['country'] = " "
        end

        csv << ["100080",
                "1",
                "#{@card.job_id}",
                record['first_name'].upcase,
                record['last_name'].upcase,
                " ",
                " ",
                 record['street'].upcase,
                " ",
                record['city'].upcase,
                record['state'].upcase,
                record['zip'],
                record['country'].upcase,
                " ",
                "SNGL PC",
                " ",
                " ",
                " ",
                " ",
                " ",
                " ",
                " ",
                "#{@card.job_id}_file_1.pdf",
                "#{@card.job_id}_file_2.pdf"
                ]
      end
      
      if @card.copy_me == TRUE
            unless @user.return_street.nil?
              @street = @user.return_street.upcase
            else
              @street = " "
            end
            unless @user.return_city.nil?
              @city = @user.return_city.upcase
            else
              @city = " ",
            end
            unless @user.return_state.nil?
              @state = @user.return_state.upcase
            else
              @state = " "
            end
            unless @user.return_zip.nil?
               @zip = @user.return_zip
             else
               @zip = " "
             end
             unless @user.return_country.nil?
               @country = @user.return_country.upcase
             else
                @country = " "
             end
          
           csv << ["100080",
                    "1",
                    "#{@card.job_id}",
                    @user.first_name.upcase,
                    @user.last_name.upcase,
                    " ",
                    " ",
                    @street,
                    " ",
                    @city,
                    @state,
                    @zip,
                    @country,
                    " ",
                    "SNGL PC",
                    " ",
                    " ",
                    " ",
                    " ",
                    " ",
                    " ",
                    " ",
                    "#{@card.job_id}_file_1.pdf",
                    "#{@card.job_id}_file_2.pdf"
                    ]

      end
      
    end
    


    filename = @jobname.downcase.gsub(/[^0-9a-z]/, "_") + ".csv"
    send_data(csv_string,
      :type => 'text/csv; charset=utf-8; header=present',
      :filename => filename)
  end



  # PUT /cards/1
  # PUT /cards/1.xml
  def update
  
    @card = Card.find(params[:id])

    respond_to do |format|
      if @card.update_attributes(params[:card])
        flash[:notice] = 'Card was successfully updated.'
        format.html { redirect_to(@card) }
        format.xml  { head :ok }
      else
        format.html { render :action => "edit" }
        format.xml  { render :xml => @card.errors, :status => :unprocessable_entity }
      end
    end
  end

  # DELETE /cards/1
  # DELETE /cards/1.xml
  def destroy
    @card = Card.find(params[:id])
    @card.destroy

    respond_to do |format|
      format.html { redirect_to(cards_url) }
      format.xml  { head :ok }
    end
  end
end
