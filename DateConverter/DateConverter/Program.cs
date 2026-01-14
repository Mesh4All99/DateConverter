using System.Globalization;
using Microsoft.AspNetCore.Mvc;

var  MyAllowSpecificOrigins = "_myAllowSpecificOrigins";
var builder = WebApplication.CreateBuilder(args);
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
        policy  =>
        {
            policy.WithOrigins("http://localhost:4200",
                "http://www.contoso.com");
        });
});
var app = builder.Build();
app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();

app.UseCors(MyAllowSpecificOrigins);

CultureInfo arabicCulture = new CultureInfo("ar-SA");
arabicCulture.DateTimeFormat.Calendar = new UmAlQuraCalendar();

CultureInfo gregorianArabicCulture = new CultureInfo("ar-SA");
gregorianArabicCulture.DateTimeFormat.Calendar = new GregorianCalendar();

app.MapGet("/", () =>
{
    var currentGregorian = DateOnly.FromDateTime(DateTime.Now);
    var arabicCult = new CultureInfo("ar-SA");
    arabicCult.DateTimeFormat.Calendar = new UmAlQuraCalendar();
    var currentHijriDate = currentGregorian.ToString("dd-MM-yyyy", arabicCulture);

    return Results.Ok(new
    {
        Hijri =  currentHijriDate,
        FullHijri = currentGregorian.ToString("D", arabicCulture),
        Gregorian = currentGregorian,
        FullGregorian = currentGregorian.ToLongDateString(),
    });
});

app.MapGet("/to-hijri", (DateTime date) =>
{
    var hijriCalendar = new UmAlQuraCalendar();

    int year = hijriCalendar.GetYear(date);
    int month = hijriCalendar.GetMonth(date);
    int day = hijriCalendar.GetDayOfMonth(date);

    string shortDate = $"{day}/{month}/{year}";
    string longDate = date.ToString("D", arabicCulture);

    return Results.Ok(new
    {
        HijriShort = shortDate,
        HijriLong = longDate
    });
});

app.MapGet("/to-gregorian", (int year, int month, int day) =>
{

    DateTime gregorianDate = new UmAlQuraCalendar().
        ToDateTime(year, month, day,0,0,0,0);

    string shortDate = gregorianDate.ToString("dd/MM/yyyy");
    string longDate = gregorianDate.ToString("dddd / MMMM / yyyy");

    return Results.Ok(new
    {
        GregorianShort = shortDate,
        GregorianLong = longDate
    });
});

app.MapGet("Date-Diff", (DateTime date, int numberOfDays) =>
{
    var total = date.AddDays(numberOfDays);
    return Results.Ok(new
    {
        DATE = total.ToString("dd/MM/yyyy"),
        Hijri = total.ToString("dd-MM-yyyy", arabicCulture),
    });
});

app.Run();