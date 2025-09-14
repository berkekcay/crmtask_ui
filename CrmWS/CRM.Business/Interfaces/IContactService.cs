using CRM.Core.Models;

namespace CRM.Business.Interfaces
{
    public interface IContactService
    {
        Task<IEnumerable<Contact>> GetAllContactsAsync();
        Task<Contact?> GetContactByIdAsync(int id);
        Task<Contact?> GetContactByEmailAsync(string email);
        Task<IEnumerable<Contact>> GetContactsByCompanyAsync(int companyId);
        Task<Contact?> GetPrimaryContactAsync(int companyId);
        Task<Contact> CreateContactAsync(Contact contact);
        Task<Contact> UpdateContactAsync(Contact contact);
        Task<bool> DeleteContactAsync(int id);
        Task<IEnumerable<Contact>> SearchContactsByNameAsync(string name);
        Task<bool> SetPrimaryContactAsync(int contactId, int companyId);
        Task<IEnumerable<Contact>> GetPagedContactsAsync(int pageNumber, int pageSize);
    }
}