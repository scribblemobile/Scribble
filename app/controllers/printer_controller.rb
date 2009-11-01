class PrinterController < ApplicationController
  
  
  
  def index
    
    if params[:shipped] == '1'
      noshipped = 0
    else
      noshipped = 1
    end
    
    @cards = Card.paginate :page => params[:page], :conditions=>"cards.printer_status != #{noshipped}", :per_page => 25, :order => 'created_at DESC'
    
    
    # @cards = Card.find(:all, :conditions=>"cards.printer_status != 1", :order=>"created_at ASC")
    
  end
  
  
  
  def generate_zip
    
    require 'zip/zip'
    require 'zip/zipfilesystem'
    require "faster_csv"
    
    if params[:password] == "scribbleprintz"
      bundle_filename = "#{RAILS_ROOT}/public/ScribbleFiles.zip"

      # check to see if the file exists already, and if it does, delete it.
      if File.file?(bundle_filename)
         File.delete(bundle_filename)
      end 

      @cards = Card.find(:all, :conditions=>"cards.printer_status = 0")
      
      #coped in printcontroller
      
        csv_string = FasterCSV.generate do |csv|
          csv << ["LINETYPE", "COUNT", "JOBID", "FIRSTNAME", "LASTNAME", "TITLE", "BUSINESS", "ADDRESS", "ADDRESS2", "CITY", "STATE", "ZIP", "COUNTRY", "DELIVERY POINT BARCODE", "SNGL PC", "CARRIER ROUTE", "WALK SEQUENCE", "CUSTOM1", "CUSTOM2", "CUSTOM3", "CUSTOM4", "CUSTOM5", "FILE_1", "FILE_2"]


        for card in @cards do
          @user = User.find(@card.user_id)
          @addresses = Address.find(:all, :conditions=>"card_id=#{card.id}")
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
                    "#{card.job_id}",
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
                    "#{card.job_id}_file_1.pdf",
                    "#{card.job_id}_file_2.pdf"
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
                  @city = " "
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
      end

       
      # open or create the zip file
      Zip::ZipFile.open(bundle_filename, Zip::ZipFile::CREATE) {
          |zipfile|
            zipfile.file.open("merge.csv", "w") { |f| f.puts csv_string }

            for card in @cards do
              
                 front = "#{RAILS_ROOT}/public/cards/#{card.id}/#{card.job_id}_file_1.pdf"
                  if File.file?(front)
                     zipfile.add( "#{card.job_id}_file_1.pdf", front)
                  end
                  
                  back = "#{RAILS_ROOT}/public/cards/#{card.id}/#{card.job_id}_file_2.pdf"
                   if File.file?(back)
                      zipfile.add( "#{card.job_id}_file_2.pdf", back)
                   end
            end
         }

         # set read permissions on the file
         File.chmod(0644, bundle_filename)

         send_file( "#{RAILS_ROOT}/public/ScribbleFiles.zip",
         :type => 'application/pdf',
         :disposition => 'inline',
         :filename => "ScribbleFiles.zip")
         
      end

    
  end


end
