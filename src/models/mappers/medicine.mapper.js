function mapMedicineToItems(medicine) {  
    return medicine.ConcentratedMedicines.map((cm, index) => {
        const pharmaForm = medicine.PharmaForms[index] || { name: "Unknown" };
        const quantityMed = medicine.QuantityMeds[index] || { quantity: "Unknown" };
        const comercialMedicine = medicine.ComercialMedicines[index] || { name: "Unknown" };
        const familyMedicine = medicine.FamilyMedicines[index] || { name: "Unknown" };

        return {
            quantityId: cm.quantity.toString(),
            magnitude: cm.magnitude,
            pharmaTypeId: pharmaForm.name.toString(),
            quantityMedList: quantityMed.quantity.toString(),
            comercialName: comercialMedicine.name,
            familyMedicineName: familyMedicine.name
        };
    });
}

function mapMedicineData(medicine) {
    return {
        id: medicine.id,
        name: medicine.name,
        creationDate: Date.now(),
        modificationDate: Date.now(),
        code: medicine.code,
        state: medicine.state,
    }
}

module.exports = { mapMedicineToItems, mapMedicineData }