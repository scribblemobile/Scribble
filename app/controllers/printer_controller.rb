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
    
    
    bundle_filename = "#{RAILS_ROOT}/public/ScribbleFiles.zip"

    # check to see if the file exists already, and if it does, delete it.
    if File.file?(bundle_filename)
       File.delete(bundle_filename)
    end 

    @cards = Card.find(:all, :conditions=>"cards.printer_status = 0")

    # open or create the zip file
    Zip::ZipFile.open(bundle_filename, Zip::ZipFile::CREATE) {
        |zipfile|
            
          for card in @cards do
            zipfile.add( "#{card.job_id}_file_1.pdf", "#{RAILS_ROOT}/public/cards/#{card.id}/#{card.job_id}_file_1.pdf")
          end
       }

       # set read permissions on the file
       File.chmod(0644, bundle_filename)

       # save the object
       self.save

    
  end


end
