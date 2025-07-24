function updateMobileNavStepper() {
    const mobileNavUl = $('#mobile-navmenu ul');
    const activeIndex = $('#mobile-navmenu li.active').index();
    const totalTabs = $('#mobile-navmenu li').length;

    mobileNavUl.attr('data-active', activeIndex);

    // Calculate dynamic width based on tab positions
    if (activeIndex === 0) {
        mobileNavUl.css('--progress-width', '0%');
    } else if (activeIndex === totalTabs - 1) {
        // Last tab - fill to 100% of available space
        mobileNavUl.css('--progress-width', '100%');
    } else {
        // Calculate percentage based on active tab position
        // Since the line stops before the last tab, we divide by (totalTabs - 1)
        const progressPercent = (activeIndex / (totalTabs - 1)) * 100;
        mobileNavUl.css('--progress-width', progressPercent + '%');
    }

    $('#mobile-navmenu li').each(function (index) {
        const $li = $(this);
        const $a = $li.find('a');

        if (index < activeIndex) {
            $a.addClass('completed').removeClass('active');
        } else if (index === activeIndex) {
            $a.addClass('active').removeClass('completed');
        } else {
            $a.removeClass('active completed');
        }
    });
}

$('#navmenu a, #mobile-navmenu a').on('click', function () {
    $('#navmenu a, #mobile-navmenu a').removeClass('active');
    $('#navmenu li, #mobile-navmenu li').removeClass('active');

    $(this).addClass('active');

    if ($(this).closest('#mobile-navmenu').length) {
        $(this).parent('li').addClass('active');
    }

    if ($(this).closest('#navmenu').length) {
        $(this).closest('li').addClass('active');
    }

    updateMobileNavStepper();
});

function navmenuScrollspy() {
    const scrollTop = $(window).scrollTop() + 200;

    $('#navmenu li, #mobile-navmenu li').removeClass('active');
    $('#navmenu a, #mobile-navmenu a').removeClass('active');

    const navmenulinks = $('#navmenu a, #mobile-navmenu a');
    let activeFound = false;

    navmenulinks.each(function () {
        const link = $(this);
        const target = $(link.attr('href'));

        if (target.length) {
            const top = target.offset().top;
            const bottom = top + target.outerHeight();

            if (scrollTop >= top && scrollTop < bottom && !activeFound) {
                const desktopLink = $('#navmenu a[href="' + link.attr('href') + '"]');
                desktopLink.addClass('active').closest('li').addClass('active');

                const mobileLink = $('#mobile-navmenu a[href="' + link.attr('href') + '"]');
                mobileLink.addClass('active').parent('li').addClass('active');

                activeFound = true;
            }
        }
    });

    updateMobileNavStepper();
}

$(window).on('scroll resize', navmenuScrollspy);

$(window).on('load', function () {
    navmenuScrollspy();
    setTimeout(navmenuScrollspy, 1000);
});

$(document).ready(function () {
    updateMobileNavStepper();
});