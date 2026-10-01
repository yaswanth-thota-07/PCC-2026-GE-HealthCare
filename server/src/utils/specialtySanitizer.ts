/**
 * Authoritative Specialty Sanitizer
 * Corrects dummy/imputed specialty lists in hospitals whose names explicitly
 * designate them as dedicated single-specialty institutions (e.g. Eye/Ophthalmology,
 * Urology, Dental, Cancer/Oncology, Orthopedic, Maternity, Pediatric, Cardiac, etc.).
 */

export function sanitizeHospitalSpecialties(hospitalName: string, existingSpecialties: string[] = []): string[] {
  if (!hospitalName) return existingSpecialties;
  const name = hospitalName.toLowerCase();

  // Multi-speciality or General institutions genuinely offer broad departments
  const isGeneralOrMulti = /\b(multispeciality|multi-speciality|multi speciality|general hospital|general nursing home|medical college|research institute|institute of medical sciences|composite hospital|district hospital|civil hospital|sub district hospital|community health centre|taluk hospital)\b/i.test(name);

  // 1. Eye / Ophthalmology
  const isEye = /\b(eye|eyes|ophthalm|retina|cornea|cataract|lasik|glaucoma|vision care|eye care|eye hospital|eye centre|eye center|eye institute|eye clinic|nethra|netra|nethralaya|netralaya|nethradhama|netradhama|drishti|akshi|nayanam)\b/i.test(name)
    && !/\b(kidney|renal|dialysis|heart|cardio)\b/i.test(name);
  if (isEye) {
    const specs = ['Ophthalmology'];
    if (/\bdental\b/i.test(name)) specs.push('Dental');
    if (/\bent\b/i.test(name)) specs.push('ENT');
    return specs;
  }

  // 2. Dental
  const isDental = /\b(dental|dentistry|dentist|tooth|teeth|orthodontic|dento)\b/i.test(name) && !isGeneralOrMulti;
  if (isDental) {
    const specs = ['Dental'];
    if (/\bmaxillofacial\b/i.test(name)) specs.push('Oral and Maxillofacial Surgery');
    return specs;
  }

  // 3. Urology & Nephrology / Kidney / Dialysis
  const isUro = /\b(urology|urological|nephro|uro-care|uro care|kidney|renal|lithotripsy|stone clinic|stone hospital|dialysis)\b/i.test(name) && !isGeneralOrMulti;
  if (isUro) {
    return ['Urology', 'Nephrology', 'General Surgery'];
  }

  // 4. Orthopedics / Bone & Joint / Spine
  const isOrtho = /\b(orthopedic|orthopaedic|ortho|bone and joint|bone & joint|joint care|joint replacement|knee clinic|fracture clinic|fracture hospital|spine hospital|spine centre|spine center|spine care)\b/i.test(name) && !isGeneralOrMulti;
  if (isOrtho) {
    return ['Orthopedics', 'General Surgery'];
  }

  // 5. Cardiology / Heart
  const isCardiac = /\b(cardiac|cardiology|cardio|heart hospital|heart institute|heart centre|heart center|heart care|cardiovascular)\b/i.test(name) && !isGeneralOrMulti;
  if (isCardiac) {
    return ['Cardiology', 'General Surgery'];
  }

  // 6. Oncology / Cancer / Tumor
  const isCancer = /\b(cancer|oncology|oncological|tumor|tumour)\b/i.test(name) && !isGeneralOrMulti;
  if (isCancer) {
    return ['Oncology', 'General Surgery'];
  }

  // 7. Gynecology / Maternity / IVF / Fertility / Women
  const isMaternity = /\b(maternity|maternal|birthing|women hospital|womens hospital|women care|mother and child|mother & child|fertility|ivf|test tube baby)\b/i.test(name) && !isGeneralOrMulti;
  if (isMaternity) {
    const specs = ['Gynecology'];
    if (/\b(child|children|pediatric|paediatric)\b/i.test(name)) specs.push('Pediatrics');
    return specs;
  }

  // 8. Pediatrics / Children
  const isPediatric = /\b(children hospital|childrens hospital|children's hospital|child hospital|child care hospital|pediatric|paediatric|kids hospital|neonatal care|pediatric centre|paediatric centre)\b/i.test(name) && !isGeneralOrMulti;
  if (isPediatric) {
    return ['Pediatrics'];
  }

  // 9. ENT
  const isEnt = /\b(ent hospital|ent centre|ent center|ent clinic|ent institute|ear nose throat|ear nose and throat)\b/i.test(name) && !isGeneralOrMulti;
  if (isEnt) {
    return ['ENT'];
  }

  // 10. Neurology / Brain & Spine
  const isNeuro = /\b(neuro hospital|neuro centre|neuro center|neuro institute|neurological|brain hospital|brain care centre|brain and spine|neurosciences)\b/i.test(name) && !isGeneralOrMulti;
  if (isNeuro) {
    return ['Neurology', 'General Surgery'];
  }

  // 11. Dermatology / Skin
  const isDerma = /\b(skin hospital|skin clinic|skin centre|skin center|skin care|derma|dermatology|hair transplant|cosmetic surgery)\b/i.test(name) && !isGeneralOrMulti;
  if (isDerma) {
    return ['Dermatology'];
  }

  // 12. Psychiatry / Mental Health
  const isPsych = /\b(psychiatric|psychiatry|mental hospital|mental health|mental wellness|deaddiction|de-addiction)\b/i.test(name) && !isGeneralOrMulti;
  if (isPsych) {
    return ['Psychiatry'];
  }

  // 13. Gastroenterology / Liver
  const isGastro = /\b(gastroenterology|gastro hospital|gastro centre|gastro center|digestive disease|digestive diseases|liver hospital|liver institute)\b/i.test(name) && !isGeneralOrMulti;
  if (isGastro) {
    return ['Gastroenterology', 'General Surgery'];
  }

  // 14. Pulmonology / Chest / Respiratory
  const isPulmo = /\b(pulmonology|pulmonary|chest hospital|chest clinic|respiratory diseases|asthma and chest|tuberculosis hospital|tb hospital)\b/i.test(name) && !isGeneralOrMulti;
  if (isPulmo) {
    return ['Pulmonology'];
  }

  return existingSpecialties && existingSpecialties.length > 0 ? existingSpecialties : ['General Surgery'];
}
