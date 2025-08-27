export const ParticipantModels = {
    Nom: {
        type: String,
        prop: 'firstname',
        required: true,
    },
    Prenom: {
        type: String,
        prop: 'lastname',
        required: true,
    },
    Secret: {
        type: String,
        prop: 'secret',
        required: true,
    },
    Telephone : {
        type: String,
        prop: 'phone_number',
        required: true,
    },
    Photo: {
        type: String,
        prop: 'photo_url',
        required: true,
    },
    Identifiant: {
        type: Number,
        prop: 'numeroIdentite',
        required: true,
    },
    Password :{
        type: String,
        prop: 'password',
        required: true,
    }

};

