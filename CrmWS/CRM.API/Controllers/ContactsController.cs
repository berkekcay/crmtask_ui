using Microsoft.AspNetCore.Mvc;
using CRM.Business.Interfaces;
using CRM.Core.Models;

namespace CRM.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ContactsController : ControllerBase
    {
        private readonly IContactService _contactService;

        public ContactsController(IContactService contactService)
        {
            _contactService = contactService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Contact>>> GetAll()
        {
            var contacts = await _contactService.GetAllContactsAsync();
            return Ok(contacts);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Contact>> GetById(int id)
        {
            var contact = await _contactService.GetContactByIdAsync(id);
            if (contact == null) return NotFound();
            return Ok(contact);
        }

        [HttpGet("company/{companyId}")]
        public async Task<ActionResult<IEnumerable<Contact>>> GetByCompany(int companyId)
        {
            var contacts = await _contactService.GetContactsByCompanyAsync(companyId);
            return Ok(contacts);
        }

        [HttpPost]
        public async Task<ActionResult<Contact>> Create(Contact contact)
        {
            var created = await _contactService.CreateContactAsync(contact);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, Contact contact)
        {
            if (id != contact.Id) return BadRequest();
            var updated = await _contactService.UpdateContactAsync(contact);
            return Ok(updated);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _contactService.DeleteContactAsync(id);
            if (!result) return NotFound();
            return NoContent();
        }
    }
}
