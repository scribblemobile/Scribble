# This file is auto-generated from the current state of the database. Instead of editing this file, 
# please use the migrations feature of Active Record to incrementally modify your database, and
# then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your database schema. If you need
# to create the application database on another system, you should be using db:schema:load, not running
# all the migrations from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20091012175624) do

  create_table "addresses", :force => true do |t|
    t.integer  "card_id"
    t.text     "first_name"
    t.text     "last_name"
    t.text     "city"
    t.text     "state"
    t.text     "zip"
    t.text     "country"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.text     "street"
    t.text     "countryCode"
    t.text     "price"
  end

  create_table "cards", :force => true do |t|
    t.integer  "user_id"
    t.integer  "frame",          :default => 0
    t.text     "message"
    t.boolean  "add_map",        :default => false
    t.boolean  "copy_me",        :default => false
    t.float    "lat"
    t.float    "lng"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.float    "price_paid"
    t.text     "photo"
    t.integer  "printer_status", :default => 0
    t.integer  "job_id"
  end

  create_table "users", :force => true do |t|
    t.string   "first_name"
    t.string   "last_name"
    t.string   "auto_login_token"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "email"
    t.string   "password"
    t.integer  "login_count"
    t.string   "device_id"
    t.string   "device_model"
    t.string   "phone_os"
    t.string   "draftphoto_file_name"
    t.string   "draftphoto_content_type"
    t.integer  "draftphoto_file_size"
    t.string   "scribble_version"
    t.string   "return_address1"
    t.string   "return_address2"
    t.string   "return_city"
    t.string   "return_state"
    t.string   "return_zip"
    t.string   "return_country"
    t.text     "street"
    t.text     "return_street"
  end

end
