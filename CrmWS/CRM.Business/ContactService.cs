using CRM.Core.Models;
using CRM.Core.Interfaces;
using CRM.Business.Interfaces;

namespace CRM.Business.Services
{
    public class ContactService : IContactService
    {
        private readonly IContactRepository _contactRepository;

        public ContactService(IContactRepository contactRepository)
        {
            _contactRepository = contactRepository;
        }

        public async Task<IEnumerable<Contact>> GetAllContactsAsync()
        {
            return await _contactRepository.GetAllAsync();
        }

        public async Task<Contact?> GetContactByIdAsync(int id)
        {
            return await _contactRepository.GetByIdAsync(id);
        }

        public async Task<Contact?> GetContactByEmailAsync(string email)
        {
            return await _contactRepository.GetByEmailAsync(email);
        }

        public async Task<IEnumerable<Contact>> GetContactsByCompanyAsync(int companyId)
        {
            return await _contactRepository.GetByCompanyAsync(companyId);
        }

        public async Task<Contact?> GetPrimaryContactAsync(int companyId)
        {
            return await _contactRepository.GetPrimaryContactAsync(companyId);
        }

        public async Task<Contact> CreateContactAsync(Contact contact)
        {
            contact.CreatedAt = DateTime.Now;
            return await _contactRepository.AddAsync(contact);
        }

        public async Task<Contact> UpdateContactAsync(Contact contact)
        {
            var existingContact = await _contactRepository.GetByIdAsync(contact.Id);
            if (existingContact == null)
            {
                throw new KeyNotFoundException("Contact not found");
            }

            contact.UpdatedAt = DateTime.Now;
            return await _contactRepository.UpdateAsync(contact);
        }

        public async Task<bool> DeleteContactAsync(int id)
        {
            var contact = await _contactRepository.GetByIdAsync(id);
            if (contact == null) return false;

            contact.IsDeleted = true;
            contact.UpdatedAt = DateTime.Now;
            await _contactRepository.UpdateAsync(contact);
            return true;
        }

        public async Task<IEnumerable<Contact>> SearchContactsByNameAsync(string name)
        {
            return await _contactRepository.SearchByNameAsync(name);
        }

        public async Task<bool> SetPrimaryContactAsync(int contactId, int companyId)
        {
            // First, remove primary status from all contacts of the company
            var existingPrimary = await _contactRepository.GetPrimaryContactAsync(companyId);
            if (existingPrimary != null)
            {
                existingPrimary.IsPrimaryContact = false;
                await _contactRepository.UpdateAsync(existingPrimary);
            }

            // Set the new primary contact
            var contact = await _contactRepository.GetByIdAsync(contactId);
            if (contact == null || contact.CompanyId != companyId) return false;

            contact.IsPrimaryContact = true;
            await _contactRepository.UpdateAsync(contact);
            return true;
        }

        public async Task<IEnumerable<Contact>> GetPagedContactsAsync(int pageNumber, int pageSize)
        {
            return await _contactRepository.GetPagedAsync(pageNumber, pageSize);
        }
    }
}
