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
  
  
  
  def generate_zip
    
    require 'zip/zip'
    require 'zip/zipfilesystem'
    
    if params[:password] == "Robbert"
      bundle_filename = "#{RAILS_ROOT}/public/ScribbleFiles.zip"

      # check to see if the file exists already, and if it does, delete it.
      if File.file?(bundle_filename)
         File.delete(bundle_filename)
      end 

      @cards = Card.find(:all, :conditions=>"cards.printer_status = 0")
      
      
      
      #coped in printcontroller
        @card = Card.find(params[:id])
        @addresses = Address.find(:all, :conditions=>"card_id=#{@card.id}")

        @jobname = "#{@card.job_id}_csv"


        csv_string = FasterCSV.generate do |csv|
          csv << ["LINETYPE", "COUNT", "JOBID", "FIRSTNAME", "LASTNAME", "TITLE", "BUSINESS", "ADDRESS", "ADDRESS2", "CITY", "STATE", "ZIP", "COUNTRY", "DELIVERY POINT BARCODE", "SNGL PC", "CARRIER ROUTE", "WALK SEQUENCE", "CUSTOM1", "CUSTOM2", "CUSTOM3", "CUSTOM4", "CUSTOM5", "FILE_1", "FILE_2"]


        for card in @cards do
          
          card.each do |record|

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
        end
      end

        filename = @jobname.downcase.gsub(/[^0-9a-z]/, "_") + ".csv"






      # open or create the zip file
      Zip::ZipFile.open(bundle_filename, Zip::ZipFile::CREATE) {
          |zipfile|
            zipfile.file.open(filename, "w") { |f| f.puts csv_string }

            for card in @cards do
              zipfile.add( "#{card.job_id}_file_1.pdf", "#{RAILS_ROOT}/public/cards/#{card.id}/#{card.job_id}_file_1.pdf")
              zipfile.add( "#{card.job_id}_file_2.pdf", "#{RAILS_ROOT}/public/cards/#{card.id}/#{card.job_id}_file_2.pdf")
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
