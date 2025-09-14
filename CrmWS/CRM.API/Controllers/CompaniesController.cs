using Microsoft.AspNetCore.Mvc;
using CRM.Business.Interfaces;
using CRM.Core.Models;

namespace CRM.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CompaniesController : ControllerBase
    {
        private readonly ICompanyService _companyService;

        public CompaniesController(ICompanyService companyService)
        {
            _companyService = companyService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Company>>> GetAll()
        {
            var companies = await _companyService.GetAllCompaniesAsync();
            return Ok(companies);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Company>> GetById(int id)
        {
            var company = await _companyService.GetCompanyByIdAsync(id);
            if (company == null) return NotFound();
            return Ok(company);
        }

        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<Company>>> Search([FromQuery] string name)
        {
            var companies = await _companyService.SearchCompaniesByNameAsync(name);
            return Ok(companies);
        }

        [HttpPost]
        public async Task<ActionResult<Company>> Create(Company company)
        {
            var created = await _companyService.CreateCompanyAsync(company);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, Company company)
        {
            if (id != company.Id) return BadRequest();
            var updated = await _companyService.UpdateCompanyAsync(company);
            return Ok(updated);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _companyService.DeleteCompanyAsync(id);
            if (!result) return NotFound();
            return NoContent();
        }
    }
}
