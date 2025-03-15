/**
 * statistics.js
 * Modul pro správu statistik
 */

const Statistics = {
    // Reference na Chart.js objekty
    charts: {
        salesChart: null
    },
    
    /**
     * Inicializuje statistiky
     */
    init: function() {
        // Inicializace grafu bude provedena až při zobrazení statistik
    },
    
    /**
     * Aktualizuje zobrazení statistik
     * @param {string} period - Období (day, week, month)
     */
    updateStats: function(period = 'day') {
        this.updateSalesStats(period);
        this.updateSalesChart(period);
    },
    
    /**
     * Aktualizuje statistiky prodejů
     * @param {string} period - Období (day, week, month)
     */
    updateSalesStats: function(period) {
        const sales = this.getSalesByPeriod(period);
        
        // Výpočet celkových tržeb
        let totalCZK = 0;
        let totalEUR = 0;
        
        sales.forEach(sale => {
            totalCZK += sale.totals.totalCZK || 0;
            totalEUR += sale.totals.totalEUR || 0;
        });
        
        // Formátování celkových tržeb
        let totalSalesText = '';
        if (totalCZK > 0 && totalEUR > 0) {
            totalSalesText = `${totalCZK.toLocaleString('cs-CZ')} Kč + ${totalEUR.toLocaleString('cs-CZ')} €`;
        } else if (totalCZK > 0) {
            totalSalesText = `${totalCZK.toLocaleString('cs-CZ')} Kč`;
        } else if (totalEUR > 0) {
            totalSalesText = `${totalEUR.toLocaleString('cs-CZ')} €`;
        } else {
            totalSalesText = '0 Kč';
        }
        
        // Zobrazení počtu prodejů
        const salesCount = sales.length;
        
        // Nalezení nejprodávanějšího produktu
        const productCounts = {};
        
        sales.forEach(sale => {
            sale.items.forEach(item => {
                if (productCounts[item.name]) {
                    productCounts[item.name] += item.quantity;
                } else {
                    productCounts[item.name] = item.quantity;
                }
            });
        });
        
        let bestSeller = '-';
        let maxCount = 0;
        
        for (const [productName, count] of Object.entries(productCounts)) {
            if (count > maxCount) {
                maxCount = count;
                bestSeller = productName;
            }
        }
        
        // Aktualizace DOM
        document.getElementById('total-sales').textContent = totalSalesText;
        document.getElementById('sales-count').textContent = salesCount;
        document.getElementById('best-seller').textContent = bestSeller;
        
        // Aktualizace aktivního filtru
        const filterButtons = document.querySelectorAll('.stats-filter-btn');
        
        filterButtons.forEach(btn => {
            if (btn.dataset.period === period) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
            
            // Přidání posluchače událostí
            btn.addEventListener('click', (e) => {
                const selectedPeriod = e.currentTarget.dataset.period;
                this.updateStats(selectedPeriod);
            });
        });
    },
    
    /**
     * Aktualizuje graf prodejů
     * @param {string} period - Období (day, week, month)
     */
    updateSalesChart: function(period) {
        const sales = this.getSalesByPeriod(period);
        const ctx = document.getElementById('sales-chart').getContext('2d');
        
        // Zničení předchozího grafu, pokud existuje
        if (this.charts.salesChart) {
            this.charts.salesChart.destroy();
        }
        
        // Příprava dat pro graf
        const data = this.prepareChartData(sales, period);
        
        // Vytvoření nového grafu
        this.charts.salesChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.labels,
                datasets: [
                    {
                        label: 'Tržby (Kč)',
                        data: data.czk,
                        backgroundColor: 'rgba(52, 152, 219, 0.7)',
                        borderColor: 'rgba(52, 152, 219, 1)',
                        borderWidth: 1
                    },
                    {
                        label: 'Tržby (€)',
                        data: data.eur,
                        backgroundColor: 'rgba(230, 126, 34, 0.7)',
                        borderColor: 'rgba(230, 126, 34, 1)',
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: this.getChartTitle(period)
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    },
    
    /**
     * Připraví data pro graf
     * @param {Array} sales - Pole prodejů
     * @param {string} period - Období (day, week, month)
     * @returns {Object} - Objekt s daty pro graf
     */
    prepareChartData: function(sales, period) {
        let labels = [];
        let czkData = [];
        let eurData = [];
        
        switch (period) {
            case 'day':
                // Příprava hodinových intervalů pro aktuální den
                for (let hour = 0; hour < 24; hour++) {
                    labels.push(`${hour}:00`);
                    
                    // Filtrování prodejů pro danou hodinu
                    const hourSales = sales.filter(sale => {
                        const saleDate = new Date(sale.timestamp);
                        return saleDate.getHours() === hour;
                    });
                    
                    // Výpočet tržeb pro danou hodinu
                    let hourCZK = 0;
                    let hourEUR = 0;
                    
                    hourSales.forEach(sale => {
                        hourCZK += sale.totals.totalCZK || 0;
                        hourEUR += sale.totals.totalEUR || 0;
                    });
                    
                    czkData.push(hourCZK);
                    eurData.push(hourEUR);
                }
                break;
                
            case 'week':
                // Příprava dnů v týdnu
                const dayNames = ['Neděle', 'Pondělí', 'Úterý', 'Středa', 'Čtvrtek', 'Pátek', 'Sobota'];
                
                for (let day = 0; day < 7; day++) {
                    labels.push(dayNames[day]);
                    
                    // Filtrování prodejů pro daný den
                    const daySales = sales.filter(sale => {
                        const saleDate = new Date(sale.timestamp);
                        return saleDate.getDay() === day;
                    });
                    
                    // Výpočet tržeb pro daný den
                    let dayCZK = 0;
                    let dayEUR = 0;
                    
                    daySales.forEach(sale => {
                        dayCZK += sale.totals.totalCZK || 0;
                        dayEUR += sale.totals.totalEUR || 0;
                    });
                    
                    czkData.push(dayCZK);
                    eurData.push(dayEUR);
                }
                break;
                
            case 'month':
                // Příprava dnů v měsíci
                const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
                
                for (let day = 1; day <= daysInMonth; day++) {
                    labels.push(day.toString());
                    
                    // Filtrování prodejů pro daný den v měsíci
                    const daySales = sales.filter(sale => {
                        const saleDate = new Date(sale.timestamp);
                        return saleDate.getDate() === day;
                    });
                    
                    // Výpočet tržeb pro daný den
                    let dayCZK = 0;
                    let dayEUR = 0;
                    
                    daySales.forEach(sale => {
                        dayCZK += sale.totals.totalCZK || 0;
                        dayEUR += sale.totals.totalEUR || 0;
                    });
                    
                    czkData.push(dayCZK);
                    eurData.push(dayEUR);
                }
                break;
        }
        
        return {
            labels: labels,
            czk: czkData,
            eur: eurData
        };
    },
    
    /**
     * Získá prodeje podle období
     * @param {string} period - Období (day, week, month)
     * @returns {Array} - Pole prodejů
     */
    getSalesByPeriod: function(period) {
        const sales = Storage.getSales();
        const currentDate = new Date();
        
        // Filtrování prodejů podle období
        return sales.filter(sale => {
            const saleDate = new Date(sale.timestamp);
            
            switch (period) {
                case 'day':
                    // Prodeje ze stejného dne
                    return (
                        saleDate.getDate() === currentDate.getDate() &&
                        saleDate.getMonth() === currentDate.getMonth() &&
                        saleDate.getFullYear() === currentDate.getFullYear()
                    );
                    
                case 'week':
                    // Prodeje ze stejného týdne
                    const dayOfWeek = currentDate.getDay();
                    const firstDayOfWeek = new Date(currentDate);
                    firstDayOfWeek.setDate(currentDate.getDate() - dayOfWeek);
                    firstDayOfWeek.setHours(0, 0, 0, 0);
                    
                    return saleDate >= firstDayOfWeek;
                    
                case 'month':
                    // Prodeje ze stejného měsíce
                    return (
                        saleDate.getMonth() === currentDate.getMonth() &&
                        saleDate.getFullYear() === currentDate.getFullYear()
                    );
                    
                default:
                    return true;
            }
        });
    },
    
    /**
     * Získá titulek grafu
     * @param {string} period - Období (day, week, month)
     * @returns {string} - Titulek grafu
     */
    getChartTitle: function(period) {
        switch (period) {
            case 'day':
                return 'Tržby za dnešní den';
            case 'week':
                return 'Tržby za aktuální týden';
            case 'month':
                return 'Tržby za aktuální měsíc';
            default:
                return 'Tržby';
        }
    },
    
    /**
     * Exportuje statistiky
     * @param {string} period - Období (day, week, month)
     */
    exportStats: function(period) {
        const sales = this.getSalesByPeriod(period);
        
        // Příprava dat pro export
        const data = {
            period: period,
            totalSales: {
                CZK: sales.reduce((total, sale) => total + (sale.totals.totalCZK || 0), 0),
                EUR: sales.reduce((total, sale) => total + (sale.totals.totalEUR || 0), 0)
            },
            salesCount: sales.length,
            sales: sales
        };
        
        // Převod na JSON
        const dataStr = JSON.stringify(data, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
        
        // Vytvoření jména souboru
        const exportName = `villa_pos_stats_${period}_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.json`;
        
        // Vytvoření odkazu a spuštění stažení
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportName);
        linkElement.click();
        
        // Zobrazení upozornění
        UI.showNotification('Statistiky byly exportovány', 'success');
    }
};

// Po načtení dokumentu
document.addEventListener('DOMContentLoaded', function() {
    // Přidání posluchače události pro tlačítko exportu statistik
    const exportStatsBtn = document.getElementById('export-stats');
    if (exportStatsBtn) {
        exportStatsBtn.addEventListener('click', function() {
            // Získání aktivního období
            const activeFilter = document.querySelector('.stats-filter-btn.active');
            const period = activeFilter ? activeFilter.dataset.period : 'day';
            
            // Export statistik
            Statistics.exportStats(period);
        });
    }
});