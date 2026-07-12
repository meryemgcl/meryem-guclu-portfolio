using Microsoft.AspNetCore.Mvc;
using PortfolioWeb.Models;
using System.Diagnostics;

namespace PortfolioWeb.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly AppDbContext _context;

        public HomeController(ILogger<HomeController> logger, AppDbContext context)
        {
            _logger = logger;
            _context = context;
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> SendMessage(ContactMessage model)
        {
            if (ModelState.IsValid)
            {
                _context.ContactMessages.Add(model);
                await _context.SaveChangesAsync();
                return Json(new { success = true, message = "Mesajınız başarıyla gönderildi!" });
            }
            return Json(new { success = false, message = "Lütfen form alanlarını kontrol edin." });
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
