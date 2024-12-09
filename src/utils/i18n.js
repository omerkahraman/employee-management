export const i18n = {
  t(key, params = {}) {
    const translations = {
      en: {
        nav: {
          employees: 'Employees',
          addNew: 'Add New'
        },
        employee: { 
          firstName: 'First Name',
          lastName: 'Last Name',
          dateOfEmployment: 'Date of Employment',
          dateOfBirth: 'Date of Birth',
          phone: 'Phone',
          email: 'Email',
          department: 'Department',
          position: 'Position',
          actions: 'Actions',
          edit: 'Edit',
          delete: 'Delete',
          noEmployees: 'No employees found'
        },
        employeeList: {
          title: 'Employee List',
          addEmployee: 'Add Employee',
          search: 'Search employees...',
          switchToTable: 'Switch to Table',
          switchToList: 'Switch to List',
          previous: 'Previous',
          next: 'Next',
          actions: 'Actions',
          edit: 'Edit',
          delete: 'Delete',
          confirmDelete: 'Are you sure you want to delete this employee?',
          selectAll: 'Select All', 
          noResults: 'No results found', 
          deleteConfirmTitle: 'Are you sure?',
          deleteConfirmMessage: 'Selected Employee record of {{employeeName}} will be deleted',
          proceed: 'Proceed',
          cancel: 'Cancel',
          close: 'Close'
        },
        employeeForm: {
          createTitle: 'Create Employee',
          editTitle: 'Edit Employee',
          firstName: 'First Name',
          lastName: 'Last Name',
          dateOfEmployment: 'Date of Employment',
          dateOfBirth: 'Date of Birth',
          phone: 'Phone',
          email: 'Email',
          department: 'Department',
          position: 'Position',
          save: 'Save',
          cancel: 'Cancel',
          departments: {
            analytics: 'Analytics',
            tech: 'Tech'
          },
          positions: {
            junior: 'Junior',
            medior: 'Medior',
            senior: 'Senior'
          }
        },
        validation: {
          required: 'This field is required',
          invalidEmail: 'Invalid email address',
          invalidPhone: 'Invalid phone number',
          invalidBirthDate: 'Birth date cannot be in the future',
          invalidEmploymentDate: 'Employment date cannot be before birth date',
          invalidYearLength: 'Invalid year format'
        },
        dialog: {
          deleteTitle: 'Are you sure?',
          deleteMessage: 'Selected Employee record of {{employeeName}} will be deleted',
          saveTitle: 'Confirm Changes',
          saveMessage: 'Do you want to save changes for {{employeeName}}?',
          proceed: 'Proceed',
          cancel: 'Cancel',
          close: 'Close'
        }
      },
      tr: {
        nav: {
          employees: 'Çalışanlar',
          addNew: 'Yeni Ekle'
        },
        employee: { 
          firstName: 'Ad',
          lastName: 'Soyad',
          dateOfEmployment: 'İşe Başlama Tarihi',
          dateOfBirth: 'Doğum Tarihi',
          phone: 'Telefon',
          email: 'E-posta',
          department: 'Departman',
          position: 'Pozisyon',
          actions: 'İşlemler',
          edit: 'Düzenle',
          delete: 'Sil',
          noEmployees: 'Çalışan bulunamadı'
        },
        employeeList: {
          title: 'Çalışan Listesi',
          addEmployee: 'Çalışan Ekle',
          search: 'Çalışan ara...',
          switchToTable: 'Tablo Görünümüne Geç',
          switchToList: 'Liste Görünümüne Geç',
          previous: 'Önceki',
          next: 'Sonraki',
          actions: 'İşlemler',
          edit: 'Düzenle',
          delete: 'Sil',
          confirmDelete: 'Bu çalışanı silmek istediğinizden emin misiniz?',
          selectAll: 'Tümünü Seç',
          noResults: 'Sonuç bulunamadı',
          deleteConfirmTitle: 'Emin misiniz?',
          deleteConfirmMessage: '{{employeeName}} isimli çalışanın kaydı silinecektir',
          proceed: 'Devam Et',
          cancel: 'İptal',
          close: 'Kapat'
        },
        employeeForm: {
          createTitle: 'Çalışan Oluştur',
          editTitle: 'Çalışan Düzenle',
          firstName: 'Ad',
          lastName: 'Soyad',
          dateOfEmployment: 'İşe Başlama Tarihi',
          dateOfBirth: 'Doğum Tarihi',
          phone: 'Telefon',
          email: 'E-posta',
          department: 'Departman',
          position: 'Pozisyon',
          save: 'Kaydet',
          cancel: 'İptal',
          departments: {
            analytics: 'Analitik',
            tech: 'Teknoloji'
          },
          positions: {
            junior: 'Junior',
            medior: 'Medior',
            senior: 'Senior'
          }
        },
        validation: {
          required: 'Bu alan zorunludur',
          invalidEmail: 'Geçersiz e-posta adresi',
          invalidPhone: 'Geçersiz telefon numarası',
          invalidBirthDate: 'Doğum tarihi bugünden sonra olamaz',
          invalidEmploymentDate: 'İşe başlama tarihi doğum tarihinden önce olamaz',
          invalidYearLength: 'Geçersiz yıl formatı'
        },
        dialog: {
          deleteTitle: 'Emin misiniz?',
          deleteMessage: '{{employeeName}} isimli çalışanın kaydı silinecektir',
          saveTitle: 'Değişiklikleri Onayla',
          saveMessage: '{{employeeName}} isimli çalışanın bilgilerini güncellemek istediğinize emin misiniz?',
          proceed: 'Devam Et',
          cancel: 'İptal',
          close: 'Kapat'
        }
      }
    };
    
    const lang = document.documentElement.lang || 'en';
    const parts = key.split('.');
    let result = translations[lang];
    
    for (const part of parts) {
      if (result && typeof result === 'object') {
        result = result[part];
      } else {
        return key; 
      }
    }

    if (typeof result === 'string' && params) {
      return result.replace(/\{\{(\w+)\}\}/g, (match, key) => params[key] || match);
    }
    
    return result || key;
  }
};