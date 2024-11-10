const fs = require('fs');
const csv = require('csv-parser');
const { parse } = require('json2csv');

// Function to generate email based on first and last name (if missing in input)
function generateEmail(firstName, lastName, emailDomain) {
    return `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${emailDomain}`;
}

// Function to process the existing CSV and generate a new CSV
function processCSV(inputFileName, outputFileName, emailDomain) {
    const students = [];

    // Read the existing CSV file
    fs.createReadStream(inputFileName)
        .pipe(csv()) // Parse the CSV
        .on('data', (row) => {
            const { student_number, school_number, first_name, last_name, grade_year, class_year, email, birthday } = row;

            // If email is missing, generate it
            const studentEmail = email || generateEmail(first_name, last_name, emailDomain);

            
            const studentBirthday = birthday || "Not Provided"; 

            // Create new student object with all necessary fields
            const student = {
                student_number,
                school_number,
                first_name,
                last_name,
                email: studentEmail,
                birthday: studentBirthday,
                grade_year,
                class_year
            };

            students.push(student); // Add to students array
        })
        .on('end', () => {
            // Convert students array back to CSV format
            const csvContent = parse(students);

            // Write to a new CSV file
            fs.writeFileSync(outputFileName, csvContent, 'utf8');
            console.log(`CSV file '${outputFileName}' has been created successfully!`);
        });
}


// Processes an existing CSV file and generates a new CSV "updated_students.csv"
processCSV("houston_student_roster_test.csv", "updated_students.csv", "Houston.isd");
