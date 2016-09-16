# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20160906004632) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "actividades", force: true do |t|
    t.string   "nombre"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "asistencia", force: true do |t|
    t.integer  "user_id"
    t.integer  "clase_id"
    t.boolean  "confirmed",  default: false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "asistencia", ["clase_id"], name: "index_asistencia_on_clase_id", using: :btree
  add_index "asistencia", ["user_id"], name: "index_asistencia_on_user_id", using: :btree

  create_table "clases", force: true do |t|
    t.integer  "actividad_id"
    t.integer  "instructor"
    t.integer  "reemplazo"
    t.date     "fecha"
    t.string   "horario"
    t.integer  "max_users"
    t.boolean  "cancelada",    default: false
    t.boolean  "trialable",    default: true
    t.string   "comment"
    t.decimal  "duracion",     default: 1.0
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "clases", ["actividad_id"], name: "index_clases_on_actividad_id", using: :btree

  create_table "identities", force: true do |t|
    t.integer  "user_id"
    t.string   "provider"
    t.string   "uid"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "identities", ["user_id"], name: "index_identities_on_user_id", using: :btree

  create_table "packs", force: true do |t|
    t.integer  "user_id"
    t.integer  "actividad_id"
    t.integer  "cantidad",     default: 1
    t.boolean  "noperiod",     default: true
    t.date     "fecha_start"
    t.date     "fecha_end"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "packs", ["actividad_id"], name: "index_packs_on_actividad_id", using: :btree
  add_index "packs", ["user_id"], name: "index_packs_on_user_id", using: :btree

  create_table "users", force: true do |t|
    t.boolean  "admin",                  default: false
    t.integer  "dni"
    t.string   "nombre"
    t.string   "apellido"
    t.string   "profesion"
    t.date     "fechanac"
    t.date     "fechaini",               default: '2016-09-15'
    t.string   "telefono"
    t.string   "domicilio"
    t.string   "localidad"
    t.string   "nombre_contacto"
    t.string   "apellido_contacto"
    t.string   "telefono_contacto"
    t.string   "sexo"
    t.boolean  "confirmed",              default: false
    t.boolean  "primera_clase",          default: true
    t.boolean  "instructor",             default: false
    t.boolean  "reminders",              default: true
    t.boolean  "newsletter",             default: false
    t.boolean  "accept_terms",           default: false
    t.string   "email",                  default: "",           null: false
    t.string   "encrypted_password",     default: "",           null: false
    t.string   "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",          default: 0,            null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.inet     "current_sign_in_ip"
    t.inet     "last_sign_in_ip"
    t.datetime "created_at",                                    null: false
    t.datetime "updated_at",                                    null: false
  end

  add_index "users", ["email"], name: "index_users_on_email", unique: true, using: :btree
  add_index "users", ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true, using: :btree

end
