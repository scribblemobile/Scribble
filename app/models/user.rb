class User < ActiveRecord::Base
  
  has_many :cards
  
  has_attached_file :draftphoto,
     :default_url => "/images/no_avatar.png",
     :url => "/:class/:attachment/:id/:style_:basename.:extension",
     :path => ":rails_root/public/:class/:attachment/:id/:style_:basename.:extension",
     :image_magick_path => "/usr/bin/",
     :whiny_thumbnails => true,
     :default_style => :thumb,
     :styles => { :small=> "50x50#", :medium=> "100x100#", :compressed=> "750x750#"}
      

  def password=(str)
		self[:password] = Digest::SHA1.hexdigest(str)
	end
	
	
	def self.authenticate(email, password)
    User.first(:conditions => ["email = ? and password = ?", email, Digest::SHA1.hexdigest(password)])
  end
  
  
end
