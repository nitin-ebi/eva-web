var test = require('selenium-webdriver/testing');

var webdriver = require('selenium-webdriver'),
    By = require('selenium-webdriver').By,
    until = require('selenium-webdriver').until,
    assert = require('selenium-webdriver/testing/assert'),
    flow = webdriver.promise.controlFlow();

var baseURL = 'http://mysite.com/apps/eva-web/src/index.html';

test.describe('European Variation Archive', function() {
    var driver;
    test.before(function() {
        driver = new webdriver.Builder()
            .forBrowser('firefox')
            .build();
        driver.get(baseURL);
    });

    test.after(function() {
        driver.quit();
    });

    test.it('Home Page', function() {
        driver.findElement(By.id("cookie-dismiss")).click();
    });

});

test.describe('Study Browser', function() {
    var driver;
    test.before(function() {
        driver = new webdriver.Builder()
            .forBrowser('firefox')
            .build();
        driver.get(baseURL);
    });

    test.after(function() {
        driver.quit();
    });
    test.it('Short Genetic Variants search by Species', function() {
        var value;
        driver.findElement(By.xpath("//li//a[text()='Study Browser']")).click();
        driver.findElement(By.xpath("//span[contains(text(),'Barley')]//..//input")).click();
        driver.findElement(By.id("study-submit-button")).click();
        value = driver.findElement(By.xpath("//div[@id='study-browser-grid']//table[1]//td[4]/div[text()]")).getText();
        assert(value).equalTo('Barley');

    });

    test.it('Structural Variants search by Species', function() {
        var value;
        driver.findElement(By.xpath("//label[@id='sv-boxLabelEl']")).click();
        sleep(3);
        driver.findElement(By.xpath("//span[contains(text(),'Chimpanzee')]//..//input")).click();
        driver.findElement(By.id("study-submit-button")).click();
        value = driver.findElement(By.xpath("//div[@id='study-browser-grid-body']//table[1]//td[4]/div/div[text()]")).getText();
        assert(value).equalTo('Chimpanzee');
    });

});

test.describe('Variant Browser', function() {
    var driver;
    test.before(function() {
        driver = new webdriver.Builder()
            .forBrowser('firefox')
            .build();
        driver.get(baseURL);
    });

    test.after(function() {
        driver.quit();
    });



    test.it('search by Variant ID', function() {
        driver.findElement(By.xpath("//li//a[text()='Variant Browser']")).click();
        //search by Variant ID
        driver.findElement(By.id("selectFilter-trigger-picker")).click();
        driver.findElement(By.xpath("//li[text()='Variant ID']")).click();
        driver.findElement(By.name("snp")).clear();
        driver.findElement(By.name("snp")).sendKeys("rs666");
        driver.findElement(By.id("vb-submit-button")).click();
        var value = driver.findElement(By.xpath("//div[@id='variant-browser-grid-body']//table[1]//tr[1]//td[1]/div[text()]")).getText();
        assert(value).equalTo('17');
    });
    test.it('search by Species', function() {
        //search by Chromosomal Location
        driver.findElement(By.id("selectFilter-trigger-picker")).click();
        driver.findElement(By.xpath("//li[text()='Chromosomal Location']")).click();
        driver.findElement(By.id("speciesFilter-trigger-picker")).click();

        //search by species
        driver.findElement(By.xpath("//li[text()='Mosquito / AgamP3']")).click();
        driver.findElement(By.id("vb-submit-button")).click();
        sleep(3);
        driver.findElement(By.id("variant-browser-grid-body"));
        until.elementIsVisible(driver.findElement(By.xpath("//div[@id='variant-browser-grid-body']//table[1]//td[1]/div[text()]")));
        var mValue = driver.findElement(By.xpath("//div[@id='variant-browser-grid-body']//table[1]//td[1]/div[text()]")).getText();
        assert(mValue).equalTo('X');

    });
    test.it('search by Gene', function() {
        // search by gene
        driver.findElement(By.id("selectFilter-trigger-picker")).click();
        driver.findElement(By.xpath("//li[text()='Ensembl Gene Symbol/Accession']")).click();
        driver.findElement(By.name("gene")).clear();
        driver.findElement(By.name("gene")).sendKeys("BRCA2");
        driver.findElement(By.id("speciesFilter-trigger-picker")).click();
        driver.findElement(By.xpath("//li[text()='Human / GRCh37']")).click();
        driver.findElement(By.id("vb-submit-button")).click();
        sleep(3);
        var gValue = driver.findElement(By.xpath("//div[@id='variant-browser-grid-body']//table[1]//td[1]/div[text()]")).getText();
        assert(gValue).contains('13');
    });
});

function sleep(value) {
    flow.execute(function () { return webdriver.promise.delayed(value * 1000);});
}

