"""Default automotive catalogue matching the Supabase schema for tony_beta3."""

# Authoritative Supabase Tables:
# 1. manufacturers (id, name, slug)
# 2. models (id, manufacturer_id, name, slug)
# 3. parts (id, name, slug)
# 4. part_synonyms (id, part_id, synonym)

DEFAULT_MANUFACTURERS: list[dict] = [
    {"id": "mfg_honda", "name": "Honda", "slug": "honda"},
    {"id": "mfg_toyota", "name": "Toyota", "slug": "toyota"},
    {"id": "mfg_ford", "name": "Ford", "slug": "ford"},
    {"id": "mfg_chevrolet", "name": "Chevrolet", "slug": "chevrolet"},
    {"id": "mfg_bmw", "name": "BMW", "slug": "bmw"},
    {"id": "mfg_mercedes", "name": "Mercedes-Benz", "slug": "mercedes-benz"},
    {"id": "mfg_audi", "name": "Audi", "slug": "audi"},
    {"id": "mfg_nissan", "name": "Nissan", "slug": "nissan"},
    {"id": "mfg_hyundai", "name": "Hyundai", "slug": "hyundai"},
    {"id": "mfg_kia", "name": "Kia", "slug": "kia"},
    {"id": "mfg_volkswagen", "name": "Volkswagen", "slug": "volkswagen"},
    {"id": "mfg_subaru", "name": "Subaru", "slug": "subaru"},
    {"id": "mfg_mazda", "name": "Mazda", "slug": "mazda"},
    {"id": "mfg_jeep", "name": "Jeep", "slug": "jeep"},
    {"id": "mfg_dodge", "name": "Dodge", "slug": "dodge"},
    {"id": "mfg_lexus", "name": "Lexus", "slug": "lexus"},
    {"id": "mfg_acura", "name": "Acura", "slug": "acura"},
    {"id": "mfg_infiniti", "name": "Infiniti", "slug": "infiniti"},
    {"id": "mfg_cadillac", "name": "Cadillac", "slug": "cadillac"},
    {"id": "mfg_chrysler", "name": "Chrysler", "slug": "chrysler"},
    {"id": "mfg_gmc", "name": "GMC", "slug": "gmc"},
    {"id": "mfg_ram", "name": "Ram", "slug": "ram"},
    {"id": "mfg_volvo", "name": "Volvo", "slug": "volvo"},
    {"id": "mfg_tesla", "name": "Tesla", "slug": "tesla"},
    {"id": "mfg_porsche", "name": "Porsche", "slug": "porsche"},
    {"id": "mfg_land_rover", "name": "Land Rover", "slug": "land-rover"},
    {"id": "mfg_jaguar", "name": "Jaguar", "slug": "jaguar"},
    {"id": "mfg_mitsubishi", "name": "Mitsubishi", "slug": "mitsubishi"},
    {"id": "mfg_buick", "name": "Buick", "slug": "buick"},
    {"id": "mfg_lincoln", "name": "Lincoln", "slug": "lincoln"},
]

DEFAULT_MODELS: list[dict] = [
    # Honda
    {"id": "mod_civic", "manufacturer_id": "mfg_honda", "name": "Civic", "slug": "civic"},
    {"id": "mod_accord", "manufacturer_id": "mfg_honda", "name": "Accord", "slug": "accord"},
    {"id": "mod_crv", "manufacturer_id": "mfg_honda", "name": "CR-V", "slug": "cr-v"},
    {"id": "mod_pilot", "manufacturer_id": "mfg_honda", "name": "Pilot", "slug": "pilot"},
    {"id": "mod_odyssey", "manufacturer_id": "mfg_honda", "name": "Odyssey", "slug": "odyssey"},
    {"id": "mod_fit", "manufacturer_id": "mfg_honda", "name": "Fit", "slug": "fit"},
    {"id": "mod_hrv", "manufacturer_id": "mfg_honda", "name": "HR-V", "slug": "hr-v"},
    {"id": "mod_ridgeline", "manufacturer_id": "mfg_honda", "name": "Ridgeline", "slug": "ridgeline"},

    # Toyota
    {"id": "mod_corolla", "manufacturer_id": "mfg_toyota", "name": "Corolla", "slug": "corolla"},
    {"id": "mod_camry", "manufacturer_id": "mfg_toyota", "name": "Camry", "slug": "camry"},
    {"id": "mod_rav4", "manufacturer_id": "mfg_toyota", "name": "RAV4", "slug": "rav4"},
    {"id": "mod_highlander", "manufacturer_id": "mfg_toyota", "name": "Highlander", "slug": "highlander"},
    {"id": "mod_prius", "manufacturer_id": "mfg_toyota", "name": "Prius", "slug": "prius"},
    {"id": "mod_tacoma", "manufacturer_id": "mfg_toyota", "name": "Tacoma", "slug": "tacoma"},
    {"id": "mod_tundra", "manufacturer_id": "mfg_toyota", "name": "Tundra", "slug": "tundra"},
    {"id": "mod_4runner", "manufacturer_id": "mfg_toyota", "name": "4Runner", "slug": "4runner"},
    {"id": "mod_sienna", "manufacturer_id": "mfg_toyota", "name": "Sienna", "slug": "sienna"},

    # Hyundai
    {"id": "mod_creta", "manufacturer_id": "mfg_hyundai", "name": "Creta", "slug": "creta"},
    {"id": "mod_elantra", "manufacturer_id": "mfg_hyundai", "name": "Elantra", "slug": "elantra"},
    {"id": "mod_sonata", "manufacturer_id": "mfg_hyundai", "name": "Sonata", "slug": "sonata"},
    {"id": "mod_tucson", "manufacturer_id": "mfg_hyundai", "name": "Tucson", "slug": "tucson"},
    {"id": "mod_santa_fe", "manufacturer_id": "mfg_hyundai", "name": "Santa Fe", "slug": "santa-fe"},
    {"id": "mod_kona", "manufacturer_id": "mfg_hyundai", "name": "Kona", "slug": "kona"},

    # Ford
    {"id": "mod_f150", "manufacturer_id": "mfg_ford", "name": "F-150", "slug": "f-150"},
    {"id": "mod_mustang", "manufacturer_id": "mfg_ford", "name": "Mustang", "slug": "mustang"},
    {"id": "mod_explorer", "manufacturer_id": "mfg_ford", "name": "Explorer", "slug": "explorer"},
    {"id": "mod_escape", "manufacturer_id": "mfg_ford", "name": "Escape", "slug": "escape"},
    {"id": "mod_focus", "manufacturer_id": "mfg_ford", "name": "Focus", "slug": "focus"},
    {"id": "mod_fusion", "manufacturer_id": "mfg_ford", "name": "Fusion", "slug": "fusion"},
    {"id": "mod_edge", "manufacturer_id": "mfg_ford", "name": "Edge", "slug": "edge"},

    # Chevrolet
    {"id": "mod_silverado", "manufacturer_id": "mfg_chevrolet", "name": "Silverado", "slug": "silverado"},
    {"id": "mod_malibu", "manufacturer_id": "mfg_chevrolet", "name": "Malibu", "slug": "malibu"},
    {"id": "mod_equinox", "manufacturer_id": "mfg_chevrolet", "name": "Equinox", "slug": "equinox"},
    {"id": "mod_tahoe", "manufacturer_id": "mfg_chevrolet", "name": "Tahoe", "slug": "tahoe"},
    {"id": "mod_suburban", "manufacturer_id": "mfg_chevrolet", "name": "Suburban", "slug": "suburban"},
    {"id": "mod_camaro", "manufacturer_id": "mfg_chevrolet", "name": "Camaro", "slug": "camaro"},
    {"id": "mod_impala", "manufacturer_id": "mfg_chevrolet", "name": "Impala", "slug": "impala"},

    # BMW
    {"id": "mod_3series", "manufacturer_id": "mfg_bmw", "name": "3 Series", "slug": "3-series"},
    {"id": "mod_5series", "manufacturer_id": "mfg_bmw", "name": "5 Series", "slug": "5-series"},
    {"id": "mod_x3", "manufacturer_id": "mfg_bmw", "name": "X3", "slug": "x3"},
    {"id": "mod_x5", "manufacturer_id": "mfg_bmw", "name": "X5", "slug": "x5"},
    {"id": "mod_m3", "manufacturer_id": "mfg_bmw", "name": "M3", "slug": "m3"},

    # Nissan
    {"id": "mod_altima", "manufacturer_id": "mfg_nissan", "name": "Altima", "slug": "altima"},
    {"id": "mod_sentra", "manufacturer_id": "mfg_nissan", "name": "Sentra", "slug": "sentra"},
    {"id": "mod_rogue", "manufacturer_id": "mfg_nissan", "name": "Rogue", "slug": "rogue"},
    {"id": "mod_pathfinder", "manufacturer_id": "mfg_nissan", "name": "Pathfinder", "slug": "pathfinder"},

    # Kia
    {"id": "mod_optima", "manufacturer_id": "mfg_kia", "name": "Optima", "slug": "optima"},
    {"id": "mod_forte", "manufacturer_id": "mfg_kia", "name": "Forte", "slug": "forte"},
    {"id": "mod_sportage", "manufacturer_id": "mfg_kia", "name": "Sportage", "slug": "sportage"},
    {"id": "mod_sorento", "manufacturer_id": "mfg_kia", "name": "Sorento", "slug": "sorento"},
    {"id": "mod_soul", "manufacturer_id": "mfg_kia", "name": "Soul", "slug": "soul"},

    # Audi
    {"id": "mod_a4", "manufacturer_id": "mfg_audi", "name": "A4", "slug": "a4"},
    {"id": "mod_a6", "manufacturer_id": "mfg_audi", "name": "A6", "slug": "a6"},
    {"id": "mod_q5", "manufacturer_id": "mfg_audi", "name": "Q5", "slug": "q5"},
    {"id": "mod_q7", "manufacturer_id": "mfg_audi", "name": "Q7", "slug": "q7"},

    # Jeep
    {"id": "mod_grand_cherokee", "manufacturer_id": "mfg_jeep", "name": "Grand Cherokee", "slug": "grand-cherokee"},
    {"id": "mod_wrangler", "manufacturer_id": "mfg_jeep", "name": "Wrangler", "slug": "wrangler"},
    {"id": "mod_cherokee", "manufacturer_id": "mfg_jeep", "name": "Cherokee", "slug": "cherokee"},
]

DEFAULT_PARTS: list[dict] = [
    {"id": "prt_bumper", "name": "bumper", "slug": "bumper"},
    {"id": "prt_front_bumper", "name": "front bumper", "slug": "front-bumper"},
    {"id": "prt_rear_bumper", "name": "rear bumper", "slug": "rear-bumper"},
    {"id": "prt_headlight", "name": "headlight", "slug": "headlight"},
    {"id": "prt_taillight", "name": "taillight", "slug": "taillight"},
    {"id": "prt_fog_light", "name": "fog light", "slug": "fog-light"},
    {"id": "prt_hood", "name": "hood", "slug": "hood"},
    {"id": "prt_fender", "name": "fender", "slug": "fender"},
    {"id": "prt_door", "name": "door", "slug": "door"},
    {"id": "prt_front_door", "name": "front door", "slug": "front-door"},
    {"id": "prt_rear_door", "name": "rear door", "slug": "rear-door"},
    {"id": "prt_trunk", "name": "trunk", "slug": "trunk"},
    {"id": "prt_tailgate", "name": "tailgate", "slug": "tailgate"},
    {"id": "prt_grille", "name": "grille", "slug": "grille"},
    {"id": "prt_mirror", "name": "mirror", "slug": "mirror"},
    {"id": "prt_side_mirror", "name": "side mirror", "slug": "side-mirror"},
    {"id": "prt_rearview_mirror", "name": "rearview mirror", "slug": "rearview-mirror"},
    {"id": "prt_windshield", "name": "windshield", "slug": "windshield"},
    {"id": "prt_engine", "name": "engine", "slug": "engine"},
    {"id": "prt_transmission", "name": "transmission", "slug": "transmission"},
    {"id": "prt_alternator", "name": "alternator", "slug": "alternator"},
    {"id": "prt_starter", "name": "starter", "slug": "starter"},
    {"id": "prt_radiator", "name": "radiator", "slug": "radiator"},
    {"id": "prt_compressor", "name": "ac compressor", "slug": "ac-compressor"},
    {"id": "prt_condenser", "name": "ac condenser", "slug": "ac-condenser"},
    {"id": "prt_steering_wheel", "name": "steering wheel", "slug": "steering-wheel"},
    {"id": "prt_steering_rack", "name": "steering rack", "slug": "steering-rack"},
    {"id": "prt_catalytic_converter", "name": "catalytic converter", "slug": "catalytic-converter"},
    {"id": "prt_exhaust", "name": "exhaust", "slug": "exhaust"},
    {"id": "prt_muffler", "name": "muffler", "slug": "muffler"},
    {"id": "prt_brake_pad", "name": "brake pad", "slug": "brake-pad"},
    {"id": "prt_brake_rotor", "name": "brake rotor", "slug": "brake-rotor"},
    {"id": "prt_brake_caliper", "name": "brake caliper", "slug": "brake-caliper"},
    {"id": "prt_wheel", "name": "wheel", "slug": "wheel"},
    {"id": "prt_rim", "name": "rim", "slug": "rim"},
    {"id": "prt_suspension", "name": "suspension", "slug": "suspension"},
    {"id": "prt_strut", "name": "strut", "slug": "strut"},
    {"id": "prt_control_arm", "name": "control arm", "slug": "control-arm"},
    {"id": "prt_axle", "name": "axle", "slug": "axle"},
    {"id": "prt_driveshaft", "name": "driveshaft", "slug": "driveshaft"},
    {"id": "prt_battery", "name": "battery", "slug": "battery"},
    {"id": "prt_fuel_pump", "name": "fuel pump", "slug": "fuel-pump"},
    {"id": "prt_water_pump", "name": "water pump", "slug": "water-pump"},
]

DEFAULT_PART_SYNONYMS: list[dict] = [
    # Headlight synonyms
    {"id": "syn_headlamp", "part_id": "prt_headlight", "synonym": "headlamp"},
    {"id": "syn_head_lamp", "part_id": "prt_headlight", "synonym": "head lamp"},
    {"id": "syn_head_light", "part_id": "prt_headlight", "synonym": "head light"},
    {"id": "syn_headlights", "part_id": "prt_headlight", "synonym": "headlights"},
    {"id": "syn_headlamps", "part_id": "prt_headlight", "synonym": "headlamps"},
    {"id": "syn_front_light", "part_id": "prt_headlight", "synonym": "front light"},
    {"id": "syn_front_lamp", "part_id": "prt_headlight", "synonym": "front lamp"},
    {"id": "syn_hedlight", "part_id": "prt_headlight", "synonym": "hedlight"},
    {"id": "syn_hedlights", "part_id": "prt_headlight", "synonym": "hedlights"},

    # Taillight synonyms
    {"id": "syn_taillamp", "part_id": "prt_taillight", "synonym": "taillamp"},
    {"id": "syn_tail_lamp", "part_id": "prt_taillight", "synonym": "tail lamp"},
    {"id": "syn_tail_light", "part_id": "prt_taillight", "synonym": "tail light"},
    {"id": "syn_taillights", "part_id": "prt_taillight", "synonym": "taillights"},
    {"id": "syn_taillamps", "part_id": "prt_taillight", "synonym": "taillamps"},
    {"id": "syn_rear_light", "part_id": "prt_taillight", "synonym": "rear light"},
    {"id": "syn_rear_lamp", "part_id": "prt_taillight", "synonym": "rear lamp"},

    # Transmission synonyms
    {"id": "syn_gearbox", "part_id": "prt_transmission", "synonym": "gearbox"},
    {"id": "syn_gear_box", "part_id": "prt_transmission", "synonym": "gear box"},
    {"id": "syn_gearboxes", "part_id": "prt_transmission", "synonym": "gearboxes"},
    {"id": "syn_gear_boxes", "part_id": "prt_transmission", "synonym": "gear boxes"},
    {"id": "syn_tranny", "part_id": "prt_transmission", "synonym": "tranny"},
    {"id": "syn_trans", "part_id": "prt_transmission", "synonym": "trans"},
    {"id": "syn_auto_trans", "part_id": "prt_transmission", "synonym": "automatic transmission"},
    {"id": "syn_manual_trans", "part_id": "prt_transmission", "synonym": "manual transmission"},

    # Brake pad synonyms
    {"id": "syn_brake_pads", "part_id": "prt_brake_pad", "synonym": "brake pads"},
    {"id": "syn_break_pad", "part_id": "prt_brake_pad", "synonym": "break pad"},
    {"id": "syn_break_pads", "part_id": "prt_brake_pad", "synonym": "break pads"},
    {"id": "syn_brake_disc", "part_id": "prt_brake_rotor", "synonym": "brake disc"},
    {"id": "syn_brake_rotors", "part_id": "prt_brake_rotor", "synonym": "brake rotors"},
    {"id": "syn_break_rotor", "part_id": "prt_brake_rotor", "synonym": "break rotor"},
    {"id": "syn_break_caliper", "part_id": "prt_brake_caliper", "synonym": "break caliper"},

    # Hood synonyms
    {"id": "syn_bonnet", "part_id": "prt_hood", "synonym": "bonnet"},
    {"id": "syn_engine_hood", "part_id": "prt_hood", "synonym": "engine hood"},

    # Trunk / Tailgate synonyms
    {"id": "syn_boot", "part_id": "prt_trunk", "synonym": "boot"},
    {"id": "syn_trunk_lid", "part_id": "prt_trunk", "synonym": "trunk lid"},
    {"id": "syn_liftgate", "part_id": "prt_tailgate", "synonym": "liftgate"},
    {"id": "syn_hatch", "part_id": "prt_tailgate", "synonym": "hatch"},

    # Mirrors
    {"id": "syn_side_view_mirror", "part_id": "prt_side_mirror", "synonym": "side view mirror"},
    {"id": "syn_door_mirror", "part_id": "prt_side_mirror", "synonym": "door mirror"},
    {"id": "syn_wing_mirror", "part_id": "prt_side_mirror", "synonym": "wing mirror"},

    # Engine
    {"id": "syn_motor", "part_id": "prt_engine", "synonym": "motor"},
    {"id": "syn_engine_block", "part_id": "prt_engine", "synonym": "engine block"},

    # Radiator
    {"id": "syn_rad", "part_id": "prt_radiator", "synonym": "rad"},

    # Glass / Windshield
    {"id": "syn_windscreen", "part_id": "prt_windshield", "synonym": "windscreen"},
    {"id": "syn_front_glass", "part_id": "prt_windshield", "synonym": "front glass"},

    # Wheel / Rim
    {"id": "syn_alloy_wheel", "part_id": "prt_rim", "synonym": "alloy wheel"},
    {"id": "syn_alloy", "part_id": "prt_rim", "synonym": "alloy"},
]

DEFAULT_RESPONSE_TEMPLATES: list[dict] = [
    # GREETING
    {"id": "tpl_greet_1", "category": "GREETING", "template_text": "Hello! How can I help you with your auto parts request today?"},
    {"id": "tpl_greet_2", "category": "GREETING", "template_text": "Hi there! What vehicle parts are you looking for?"},
    {"id": "tpl_greet_3", "category": "GREETING", "template_text": "Hey! Tell me the year, make, model, and part you need."},

    # CONFIRM
    {"id": "tpl_conf_1", "category": "CONFIRM", "template_text": "Did you mean {candidate}?"},
    {"id": "tpl_conf_2", "category": "CONFIRM", "template_text": "Just to confirm, are you looking for {candidate}?"},
    {"id": "tpl_conf_3", "category": "CONFIRM", "template_text": "To make sure I have that right, did you mean {candidate}?"},

    # ASK_VEHICLE
    {"id": "tpl_ask_veh_1", "category": "ASK_VEHICLE", "template_text": "What is the make and model of your vehicle?"},
    {"id": "tpl_ask_veh_2", "category": "ASK_VEHICLE", "template_text": "Which vehicle (year, make, and model) do you need parts for?"},
    {"id": "tpl_ask_veh_3", "category": "ASK_VEHICLE", "template_text": "Please provide the make and model for your vehicle."},

    # ASK_MAKE
    {"id": "tpl_ask_make_1", "category": "ASK_MAKE", "template_text": "What make is your {model}?"},
    {"id": "tpl_ask_make_2", "category": "ASK_MAKE", "template_text": "Which make is your {model}?"},
    {"id": "tpl_ask_make_3", "category": "ASK_MAKE", "template_text": "What is the make of your {model}?"},

    # ASK_MODEL
    {"id": "tpl_ask_mod_1", "category": "ASK_MODEL", "template_text": "Which {manufacturer} model do you have?"},
    {"id": "tpl_ask_mod_2", "category": "ASK_MODEL", "template_text": "What model is your {manufacturer}?"},
    {"id": "tpl_ask_mod_3", "category": "ASK_MODEL", "template_text": "What specific model of {manufacturer} are you searching for?"},

    # ASK_YEAR
    {"id": "tpl_ask_yr_1", "category": "ASK_YEAR", "template_text": "What year is your {manufacturer} {model}?"},
    {"id": "tpl_ask_yr_2", "category": "ASK_YEAR", "template_text": "Could you please specify the year of your {manufacturer} {model}?"},
    {"id": "tpl_ask_yr_3", "category": "ASK_YEAR", "template_text": "What is the model year of your {vehicle}?"},

    # ASK_PART
    {"id": "tpl_ask_part_1", "category": "ASK_PART", "template_text": "What part do you need for your {vehicle}?"},
    {"id": "tpl_ask_part_2", "category": "ASK_PART", "template_text": "Which specific part are you looking for on your {vehicle}?"},
    {"id": "tpl_ask_part_3", "category": "ASK_PART", "template_text": "Got the vehicle: {vehicle}. What part do you need?"},

    # FOUND
    {"id": "tpl_found_1", "category": "FOUND", "template_text": "Got it. You're looking for a {part} for your {vehicle}."},
    {"id": "tpl_found_2", "category": "FOUND", "template_text": "Great, I have your request for a {vehicle} {part}."},
    {"id": "tpl_found_3", "category": "FOUND", "template_text": "Searching our inventory for a {vehicle} {part}."},

    # PART_SEARCH
    {"id": "tpl_search_1", "category": "PART_SEARCH", "template_text": "Searching available stock for a {vehicle} {part}."},
    {"id": "tpl_search_2", "category": "PART_SEARCH", "template_text": "Checking part availability for your {vehicle} {part}."},

    # CORRECTION
    {"id": "tpl_corr_1", "category": "CORRECTION", "template_text": "Updated! Now looking for a {part} for your {vehicle}."},
    {"id": "tpl_corr_2", "category": "CORRECTION", "template_text": "Got it, I've updated the vehicle to {vehicle}."},

    # THANKS
    {"id": "tpl_thanks_1", "category": "THANKS", "template_text": "You're welcome! Let me know if you need any other parts."},
    {"id": "tpl_thanks_2", "category": "THANKS", "template_text": "Happy to help! Feel free to ask about any additional auto parts."},
    {"id": "tpl_thanks_3", "category": "THANKS", "template_text": "Anytime! Let me know if you need anything else."},

    # GOODBYE
    {"id": "tpl_bye_1", "category": "GOODBYE", "template_text": "Goodbye! Have a great day."},
    {"id": "tpl_bye_2", "category": "GOODBYE", "template_text": "Thanks for visiting! Have a wonderful day."},
    {"id": "tpl_bye_3", "category": "GOODBYE", "template_text": "Bye! Let us know if you need auto parts in the future."},

    # OUT_OF_SCOPE
    {"id": "tpl_out_of_scope_1", "category": "OUT_OF_SCOPE", "template_text": "I can only assist with auto parts requests. What vehicle part are you looking for?"},
    {"id": "tpl_out_of_scope_2", "category": "OUT_OF_SCOPE", "template_text": "I'm an auto parts assistant and can't help with that. What vehicle part do you need?"},
    {"id": "tpl_out_of_scope_3", "category": "OUT_OF_SCOPE", "template_text": "I specialize in auto parts search. Please tell me your vehicle year, make, model, and the part needed."},

    # NOT_FOUND
    {"id": "tpl_not_found_1", "category": "NOT_FOUND", "template_text": "I couldn't identify that vehicle or part. Could you please provide the make, model, year, or part name?"},
    {"id": "tpl_not_found_2", "category": "NOT_FOUND", "template_text": "Sorry, I didn't recognize that request. Please tell me your vehicle year, make, model, and the part needed."},
]


